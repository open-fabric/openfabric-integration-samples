const express = require("express");
const request = require("request");

const app = express();
const port = 8080;

const clientId = "<your client id here>";
const clientSecret = "<your client secret here>";
const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

const options = {
  method: 'POST',
  url: 'https://auth.dev.openfabric.co/oauth2/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    /*
     * Authorization header is base64 encoded value 
     * of your clientId and clientSecret
    */ 
    Authorization: `Basic ${auth}`,
  },
  form: {grant_type: 'client_credentials'}
};

app.get("/of-auth", (req, res) =>
    request(options, (error, response, body) => {
        if (!error) {
            const bodyJS = JSON.parse(body);
            res.json(bodyJS);
        }
    }));

app.listen(port, () => {
    console.log(`Start Merchant Server: http://localhost:${port}`);
});