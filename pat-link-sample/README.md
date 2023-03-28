# End-to-end sample for Ingenico POS checkout with QR

A sample to demonstrate end to end integration between ****Ingenico & Open Farbic**** using QR payment.

## Prerequisites and setup

* [Node.js](https://nodejs.org/en/) v16.0.0 or higher

## Prepare your Env file

Create **.env** file in root of this folder, according to your input Merchant credential - you can check the .sample.env file for more details

```shell
OF_AUTH_ENDPOINT=https://auth.dev.openfabric.co
OF_API_ENDPOINT=
MERCHANT_CLIENT_ID=
MERCHANT_CLIENT_SECRET=
```

**Note:**

* Merchant credential could be found in your Open Fabric Portal

## Running sample on local

Make sure you done [this](#prepare-your-env-file)

* To build the souce code
```shell
yarn build
```

* To start server

```shell
yarn start
```

Open <http://localhost:3005> on browser and start your experience

