const express = require("express");
const request = require("request");
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());

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
    request("https://issuer.sandbox.openfabric.co/i/fetchCard", options(req), (error, response, body) => {
        if (!error) {
            res.json(body);
        }
    }));

app.listen(port, () => {
    console.log(`Start Fetch Card Details Endpoint: http://localhost:${port}`);
});
