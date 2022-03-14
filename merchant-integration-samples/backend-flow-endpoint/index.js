const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//================= prepare value ===================
const port = 8080;
const merchantClientId = process.env.MERCHANT_CLIENT_ID;
const merchantClientSecret = process.env.MERCHANT_CLIENT_SECRET;
const authEndPoint = process.env.OF_AUTH_URL;
const env = process.env.ENV || "sandbox";
const auth = Buffer.from(
  `${merchantClientId}:${merchantClientSecret}`
).toString("base64");

const fetchCardAuthOptions = {
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
    scope: `resources/cards.read`,
  },
};

const fetchCardOptions = ({ card_fetch_token, access_token }) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
  body: { card_fetch_token: card_fetch_token },
  json: true,
});

const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
    "Accept-Language",
    "User-Agent",
    "Host",
    "X-Forwarded-For",
  ],
};
//================= end of prepare value ===================


app.use(bodyParser.json());
app.set("trust proxy", true);

app.use(cors(corsOptions));

const parseBody = body => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
};

const asyncRequest = (url, options) =>
  new Promise((resolve, reject) =>
    request(url, options, (error, res, body) => {
      if (!error && res.statusCode > 199 && res.statusCode < 300) {
        resolve(body ? parseBody(body) : true);
      } else {
        reject(
          error ?? `HTTP error: ${res.statusCode} ${JSON.stringify(res.body)}`
        );
      }
    })
  );

app.post("/fetch-card-details", async (req, res) => {
  try {
    const merchantToken = req.headers.authorization;
    if (!merchantToken) {
      return res.status(401).json({ error: "Authorization is not valid" });
    }

    const card_fetch_token = req.body && req.body.card_fetch_token;
    if (!card_fetch_token) {
      return res.status(400).json({ error: "card_fetch_token is missing" });
    }
    // fetch Merchant Token with scope cards.read
    const { access_token } = await asyncRequest(
      authEndPoint,
      fetchCardAuthOptions
    );

    const result = await asyncRequest(
      `https://issuer.${env}.openfabric.co/i/fetchCard`,
      fetchCardOptions({ card_fetch_token, access_token })
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Start Fetch Card Details Endpoint: http://localhost:${port}`);
});
