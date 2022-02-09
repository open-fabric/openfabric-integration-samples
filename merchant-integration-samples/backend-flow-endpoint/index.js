const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.set("trust proxy", true);
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
app.use(cors(corsOptions));
const options = (request) =>
    ({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: request.headers.authorization,
        },
        body: { card_fetch_token: request.body.card_fetch_token },
        json: true
    });

app.post("/fetch-card-details", (req, res) =>
    request(`https://issuer.${process.env.ENV}.openfabric.co/i/fetchCard`, options(req), (error, response, body) => {
        if (!error) {
            res.json(body);
        }
    }));

app.listen(port, () => {
    console.log(`Start Fetch Card Details Endpoint: http://localhost:${port}`);
});
