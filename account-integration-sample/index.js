import { v4 as uuid } from "uuid";
import path from "path";
import express from "express";
import request from "request";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

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

// Set CLIENT_ID, CLIENT_SECRET, GATEWAY_URL, AUTH_END_POINT in the .env file
const auth = Buffer.from(
  `${process.env.ACCOUNT_CLIENT_ID}:${process.env.ACCOUNT_CLIENT_SECRET}`
).toString("base64");
const basePath = process.env.OF_API_URL;
const authEndPoint = process.env.OF_AUTH_URL;

const asyncRequest = (url, options) =>
  new Promise((resolve, reject) =>
    request(url, options, (error, res, body) => {
      if (!error && res.statusCode > 199 && res.statusCode < 300) {
        resolve(body ? JSON.parse(body) : true);
      } else {
        reject(error ?? `HTTP error: ${res.statusCode} ${JSON.stringify(res.body)}`);
      }
    })
  );

const authOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    /*
     * Authorization header is base64 encoded value
     * of your clientId and clientSecret
     */
    Authorization: `Basic ${auth}`,
  },
  form: { grant_type: "client_credentials" },
};

const config = (token, method, body) => ({
  method,
  json: !!body,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Render "Approve" and "Cancel" buttons
app.get("/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    console.error("Missing `id` in query");
    return;
  }
  try {
    const { access_token } = await asyncRequest(authEndPoint, authOptions);
    const transInfo = await asyncRequest(
      `${basePath}/t/transactions/${id}`,
      config(access_token, "GET")
    );
    res.render("index", {
      account_reference_id: transInfo?.account_reference_id,
      id,
    });
  } catch (error) {
    console.error("Index error: ", error);
  }
});

app.post("/account-create-transaction", async (req, res) => {
  const body = req.body;
  const response = {
    account_reference_id: uuid(),
    // url for customer redirect to account system
    payment_redirect_web_url: `http://localhost:${port}?id=${body.fabric_reference_id ||
      body.id}`,
  };
  return res.status(200).send(response);
});

app.post("/approve", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    console.error("Missing `id` in body");
    return;
  }
  try {
    const { access_token } = await asyncRequest(authEndPoint, authOptions);
    const transInfo = await asyncRequest(
      `${basePath}/t/transactions/${id}`,
      config(access_token, "GET")
    );
   const response = await asyncRequest(
      `${basePath}/t/transactions`,
      config(access_token, "PUT", req.body)
    )
    res.redirect(transInfo.gateway_success_url);
  } catch (error) {
    console.error("Approve error: ", JSON.stringify(error));
  }
});

app.post("/cancel", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    console.error("Missing `id` in body");
    return;
  }
  try {
    const { access_token } = await asyncRequest(authEndPoint, authOptions);
    const transInfo = await asyncRequest(
      `${basePath}/t/transactions/${id}`,
      config(access_token, "GET")
    );
    await asyncRequest(
      `${basePath}/t/transactions`,
      config(access_token, "PUT", req.body)
    );
    res.redirect(transInfo.gateway_fail_url);
  } catch (error) {
    console.error("Cancel error: ", error);
  }
});

app.listen(port, () => {
  console.log(`Start Account Server, visit http://localhost:${port}`);
});
