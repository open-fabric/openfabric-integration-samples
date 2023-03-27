# End-to-end sample for Ingenico POS checkout with QR

A sample to demonstrate end to end integration between ****Ingenico & Open Farbic**** using QR payment.

## Prerequisites and setup

* [Node.js](https://nodejs.org/en/) v16.0.0 or higher

## Prepare your Env file

Create **.env** file in root of this folder, according to your input Merchant credential - you can check the .sample.env file for more details

```shell
NEXT_PUBLIC_ENV=<environment for nextjs>
OF_INGENICO_TRANSACTIONS_URL=<Open Fabric endpoint to accept Ingenico transactions>
INGENICO_SERVICE_IMPLEMENTATION_ID=<Ingenico PPaaS Service Provider Id>
INGENICO_ORGANIZATION_ID=<Ingenico PPaaS Acquirer Organization Id>
INGENICO_MERCHANT_ID=<Ingenico PPaaS Merchant Id>
INGENICO_STORE_ID=<Ingenico PPaaS Store Id>
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

Open <http://localhost:3004> on browser and start your experience

