import { v4 as uuid } from "uuid";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { getTransactionById } from "./utilities/getTransactionById";
import { approveTransaction } from "./utilities/approveTransaction";
import { cancelTransaction } from "./utilities/cancelTransaction";
import { createEmbeddedTransaction } from "./utilities/createTransactions_embedded";
import { fetchCardInfo } from "./utilities/fetchCardInfo";
import {
  addNewTransaction,
  readTransaction,
  updateTransaction,
  clearTransactions
} from "./db/index";

const TRUSTED_API_KEY = "sample-api-key";
const port = 3001;
const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//========================== ORCHESTRATED FLOW ========================

// Render "Approve" and "Cancel" buttons
app.get("/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    console.error("Missing `id` in query");
    return;
  }
  try {
    const transInfo = await getTransactionById({
      transaction_id: id,
    });
    res.render("index", {
      account_reference_id: transInfo?.account_reference_id,
      id,
    });
  } catch (error) {
    console.error("Index error: ", error);
  }
});

// Sample implementation of Create Transaction API that will be called by OF.
app.post("/transactions", async (req, res) => {
  const body = req.body;
  const response = {
    account_reference_id: uuid(),
    // url for customer redirect to account system
    payment_redirect_web_url: `http://localhost:${port}?id=${body.fabric_reference_id ||
      body.id}`,
  };
  return res.status(200).send(response);
});

// Sample implementation of Approve Transaction workflow.
app.post("/transactions/approve", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    console.error("Missing `id` in body");
    return;
  }
  try {
    await approveTransaction({
      account_reference_id: req.body.account_reference_id,
    });
    const transInfo = await getTransactionById({
      transaction_id: id,
    });
    res.redirect(transInfo.gateway_success_url);
  } catch (error) {
    console.error("Approve error: ", JSON.stringify(error));
  }
});

// Sample implementation of Cancel Transaction workflow.
app.post("/transactions/cancel", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    console.error("Missing `id` in body");
    return;
  }
  try {
    await cancelTransaction({
      account_reference_id: req.body.account_reference_id,
      reason: req.body.reason,
    });
    const transInfo = await getTransactionById({
      transaction_id: id,
    });
    res.redirect(transInfo.gateway_fail_url);
  } catch (error) {
    console.error("Cancel error: ", error);
  }
});

// Sample implementation for webhook to receive OF notifications .
app.post("/transactions/callback", async (req, res) => {
  try {
    if (req.header("X-Api-Key") === TRUSTED_API_KEY) {
      console.log(
        "Received OF notifications: ",
        JSON.stringify(req.body, null, 2)
      );
      req.body.forEach((notification) => {
        console.log(
          `Transaction charged: id=${notification.account_reference_id}, status=${notification.status}, charged_at=${notification.charged_at}`
        );
      });
      return res.status(200).send({ status: "Success" });
    } else {
      return res
        .status(401)
        .send({ status: "Failed", reason: "Unauthenticated" });
    }
  } catch (error) {
    console.error("Callback error: ", error);
    return res.status(500).send({ status: "Failed", reason: error.message });
  }
});
//========================== END OF ORCHESTRATED FLOW ========================

//========================== EMBEDDED FLOW ========================

// Embedded flow
app.post("/embedded-flow", async (req, res) => {
  try {
    const account_reference_id = req.body.account_reference_id;
    const transInfo = readTransaction(account_reference_id);
    const response = await createEmbeddedTransaction({
      transaction: transInfo,
    });
    const updatedTrans = {
      ...transInfo,
      status: response.status,
      ofTransaction: response,
    };
    updateTransaction(updatedTrans);
    return res.status(200).json(updatedTrans);
  } catch (err) {
    console.error("Create Transaction - Embedded Flow - error: ", err);
  }
});

// Render UI PG Embedded flow
app.get("/embedded/checkout-approved", async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  if (!account_reference_id) {
    console.error("Missing `account_reference_id` in query");
    return;
  }
  const transInfo = readTransaction(account_reference_id);
  if (!transInfo) {
    console.error("No transaction matching " + account_reference_id);
    return;
  }
  res.render("embedded-checkout-approved", {
    ...transInfo,
  });
});

app.post("/merchant/create-transaction", async (req, res) => {
  try {
    const accountTransaction = {
      ...req.body,
      account_reference_id: `ACC-REF-${Date.now()}`,
    };
    addNewTransaction(accountTransaction);
    return res.status(200).send({
      ...accountTransaction,
      redirect_url: `http://localhost:${port}/embedded/checkout-approved?account_reference_id=${accountTransaction.account_reference_id}`,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});

app.get("/fetchCard", async (req, res) => {
  try {
    const account_reference_id = req.query.account_reference_id;
    if (!account_reference_id) {
      console.error("Missing `account_reference_id` in query");
      return;
    }
    const transInfo = readTransaction(account_reference_id);
    if (!transInfo) {
      console.error("No transaction matching " + account_reference_id);
      return;
    }
    if (transInfo.ofTransaction && transInfo.ofTransaction.card_fetch_token) {
      const response = await fetchCardInfo({
        account_reference_id,
        card_fetch_token: transInfo.ofTransaction.card_fetch_token,
      });
      updateTransaction({...transInfo, cardInfo: response})
      return res.status(200).json(response);
    }
    throw new Error("There is no info related to OpenFabric card_fetch_token");
  } catch (err) {
    console.log("=== err", err);
    return res.status(500).json({
      error: err,
    });
  }
});
//========================== END OF EMBEDDED FLOW ========================

app.listen(port, () => {
  clearTransactions();
  console.log(`Start Account Server, visit http://localhost:${port}`);
});
