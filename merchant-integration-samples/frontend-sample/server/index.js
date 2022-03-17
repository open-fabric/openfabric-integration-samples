import path from "path";
import express from "express";
import request from "request";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { addNewTransaction, clearTransactions } from "./db/index";
import { createAccountTransaction } from "./utilities/createAccountTransactions";

dotenv.config();
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set CLIENT_ID & CLIENT_SECRET in the .env file
const auth = Buffer.from(
  `${process.env.MERCHANT_CLIENT_ID}:${process.env.MERCHANT_CLIENT_SECRET}`
).toString("base64");
const authEndpoint = process.env.OF_AUTH_URL;
const authOptions = ({ scope }) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    /*
     * Authorization header is base64 encoded value
     * of your clientId and clientSecret
     */
    Authorization: `Basic ${auth}`,
  },
  form: {
    grant_type: "client_credentials",
    scope: scope,
  },
});

app.get("/of-auth", (req, res) =>
  request(
    authEndpoint,
    authOptions({
      scope: `resources/transactions.read resources/transactions.write`,
    }),
    (error, response, body) => {
      if (!error) {
        const bodyJS = JSON.parse(body);
        res.json(bodyJS);
      } else {
        console.error(error);
        res.status(500).json(error);
      }
    }
  )
);

app.get("/fill-flow/of-auth", (req, res) =>
  request(
    authEndpoint,
    authOptions({
      scope: `resources/transactions.read resources/transactions.write resources/cards.read`,
    }),
    (error, response, body) => {
      if (!error) {
        const bodyJS = JSON.parse(body);
        res.json(bodyJS);
      } else {
        console.error(error);
      }
    }
  )
);

app.get("/vanilla", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "vanilla.html"))
);

app.get("/embedded/checkout", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "checkout-form", "index.html"))
);

app.post("/embedded/checkout", async (req, res) => {
  try {
    const merchantTrans = { ...req.body, status: "Created" };
    addNewTransaction(merchantTrans);
    const response = await createAccountTransaction(merchantTrans);
    res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

app.get("/pg-embedded", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "Embedded.html"))
);

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "build", "index.html"))
);

app.listen(process.env.PORT || port, () => {
  clearTransactions();
  console.log(
    `Check Merchant Integration Sample: http://localhost:${process.env.PORT ||
      port}`
  );
});
