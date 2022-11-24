# End-to-end merchant sample for card handover using Open Fabric's SDK

A sample to demonstrate end to end integration between ****Merchants & Open Farbic****

## Prerequisites and setup

* [Node.js](https://nodejs.org/en/) v16.0.0 or higher

## Prepare your Env file

Create **.env** file in root of this folder, according to your input Merchant credential - you can check the .sample.env file for more details

```shell
MERCHANT_CLIENT_ID=<your merchant client id credential, must be the merchant of your account>
MERCHANT_CLIENT_SECRET=<your merchant client secret credential, must be the merchant of your account >
OF_AUTH_URL=<Open Fabric auth server url>
CARD_ISSUER_SERVER_URL=<Open Fabric card issuer server url>
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

Open <http://localhost:3000> on browser and start your experience

## Structure

To give the best experiences and simplifying the integration between Merchant and Open Fabric, we provides 2 versions of souce code. The fist one is written in typescript, nextjs. And the second one is the simplifying one which are quite familiar with most of developers, written in html and javascript.

* sdk-card-sample
  * [Client site (nextjs)](pages/demo/sdk-card.tsx)
  * [Server site (nextjs)](pages/api)
  * [Simple client site version (html and javascript)](public/sdk-card.html)


**For Open Fabric's SDK usages**

To initialize Open Fabric's SDK
``` typescript
const openFabric = OpenFabric(
  accessToken,
  `${window.location.origin}/demo/sdk-card-success?merchant_ref=${order.partner_reference_id}`,
  `${window.location.origin}/demo/sdk-card-failed?merchant_ref=${order.partner_reference_id}`
)
  .setEnvironment(env);
```
`${window.location.origin}/demo/sdk-card-success?merchant_ref=${order.partner_reference_id}` is the success page that Open Fabric's SDK redirect to

`${window.location.origin}/demo/sdk-card-fail?merchant_ref=${order.partner_reference_id}` is the failed page that Open Fabric's SDK redirect to

To create an order and initialize the SDK

``` typescript
openFabric.createOrder(order);
await openFabric.initialize();
```

To start the flow
``` typescript
openFabric.startFlow();
```

To fetch card
  * After the flow is success, Open Fabric's sdk will redirect merchant to the success page with `txn_card_token` appended to query string. Merchant server could use this token to fetch card information from Open Fabric Card Issuer server.

``` typescript
const result = await axios.post(
    `${process.env.CARD_ISSUER_SERVER_URL}/i/fetchCard`,
    {
      card_fetch_token,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
```
