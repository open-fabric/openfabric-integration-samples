import { v4 as uuid } from "uuid";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { getAccessToken } from "./utilities/getAccessToken";
import { getTransactionById } from "./utilities/getTransactionById";
import { approveTransaction } from "./utilities/approveTransaction";
import { cancelTransaction } from "./utilities/cancelTransaction";
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

// Render "Approve" and "Cancel" buttons
app.get("/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    console.error("Missing `id` in query");
    return;
  }
  try {
    const { access_token } = await getAccessToken();
    const transInfo = await getTransactionById({
      access_token,
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
    const { access_token } = await getAccessToken();
    await approveTransaction({
      access_token,
      account_reference_id: req.body.account_reference_id,
    });
    const transInfo = await getTransactionById({
      access_token,
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
    const { access_token } = await getAccessToken();
    await cancelTransaction({
      access_token,
      account_reference_id: req.body.account_reference_id,
      reason: req.body.reason,
    });
    const transInfo = await getTransactionById({
      access_token,
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

app.listen(port, () => {
  console.log(`Start Account Server, visit http://localhost:${port}`);
});
