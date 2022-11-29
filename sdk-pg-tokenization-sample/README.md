# End-to-end merchant sample for PG tokenization flow using Open Fabric's SDK

A sample to demonstrate end to end integration between ****Merchants & Open Farbic****

## Prerequisites and setup

* [Node.js](https://nodejs.org/en/) v16.0.0 or higher

## Prepare your Env file

Create **.env** file in root of this folder, according to your input Merchant credential - you can check the .sample.env file for more details

```shell
NEXT_PUBLIC_ENV=<environment for nextjs>
MERCHANT_CLIENT_ID=<your merchant client id credential, must be the merchant of your account>
MERCHANT_CLIENT_SECRET=<your merchant client secret credential, must be the merchant of your account>
OF_AUTH_URL=<Open Fabric auth server url>
NEXT_PUBLIC_PAYMENT_GATEWAY_NAME=<Payment gateway name for nextjs>
NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY=<Payment gateway API publishable key for nextjs>
```

**Note:**

* Merchant credential could be found in your Open Fabric Portal
* `{ENV}, {PAYMENT_GATEWAY_NAME}, {PAYMENT_GATEWAY_PUBLISH_KEY}` in [public/sdk-pg-tokenization.html](./public/sdk-pg-tokenization.html) should be replaced to your expected value
* NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY could be optional if PG Merchant PG credentials have been registered to Open Fabric.

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

* [sdk-pg-tokenization-sample](./../sdk-pg-tokenization-sample/)
  * [Client site (nextjs)](pages/demo/sdk-pg-tokenization.tsx)
  * [Server site (nextjs)](pages/api)
  * [Simple client site version (html and javascript)](public/sdk-pg-tokenization.html)


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

To request Open Fabric for pg tokenization flow, you need to set `order` with below specific information
``` typescript
order = {
  ...
  pg_name: <your pg name>, // could not be null
  pg_flow: 'tokenization', // default value is tokenization, could be null
  pg_publishable_key: <your payment gateway api publishable key> // could be null if credentials have been registered to Open Fabric
}
```

To start the flow
``` typescript
openFabric.startFlow();
```
