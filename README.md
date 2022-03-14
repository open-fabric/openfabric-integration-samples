# End-to-end account & merchant sample

A sample to demonstrate end to end integration between ****Merchants**** & ****Accounts****

## Prerequisites and setup

* [Docker](https://www.docker.com/products/overview)
* [Docker Compose](https://docs.docker.com/compose/overview/) - v2.2.3 or higher
* [Node.js](https://nodejs.org/en/) v16.0.0 or higher
* [jq](https://stedolan.github.io/jq/) 1.6 or higher

## Running the sample program

### Step 1: Update env file

Create **.env** file in root of this folder, according to your input Account/Merchant credential - you can check the .sample.env file for more details

```shell
ACCOUNT_CLIENT_ID=<your account client id credential>
ACCOUNT_CLIENT_SECRET=<your account client secret credential>
MERCHANT_CLIENT_ID=<your merchant client id credential, must be the merchant of your account>
MERCHANT_CLIENT_SECRET=<your merchant client secret credential, must be the merchant of your account >
PAYMENT_METHODS=<your account slug>
```

**Note:**

* Merchant credential could be found in your Open Fabric Portal

*Some additional config value if you want to try ***PGToken Flow****

```shell
PAYMENT_GATEWAY_PUBLISH_KEY=<Your merchant PG publish key>
PAYMENT_GATEWAY_NAME=<your merchant PG name, e.g: Xendit>
```

### Step 2: Run your sample

```shell
sh start.sh
```

or if you already setup your own account server

```shell
sh start.sh -s
```

* Without specifying any parameter, we gonna proxy a public sample account server for your experience

* By using `-s` you can skip this step and using your own configuration account server

Open <http://localhost:3000> on your browser and experience is ready to use.

For more details, this is our scenario:
* _Orchestrated flow_
  * [http://localhost:3000/](http://localhost:3000/) for the React sample application
  * [http://localhost:3000/vanilla](http://localhost:3000/vanilla) for the vanilla JS application
  * [http://localhost:3000/pg](http://localhost:3000/pg) for the Payment Gateway sample application (only valid if you input config value for this flow)
  * [http://localhost:3000/backend](http://localhost:3000/backend) for the Backend flow application
* Embedded Flow
  * [http://localhost:3000/embedded/checkout](http://localhost:3000/embedded/checkout) for the EmbeddedFlow

## Structure

* [x] Merchant-integation-samples:
  * [x] Front-end sample
  * Demonstrate how to use our **MerchantSDK** 
    * [React sample](merchant-integration-samples/frontend-sample/src/FillSample.tsx) 
    * [Vanilla sample](merchant-integration-samples/frontend-sample/server/public/vanilla.html)
    * [PG Sample](merchant-integration-samples/frontend-sample/src/PGSample.tsx)
    * [FE Sample for **Backend flow**](merchant-integration-samples/frontend-sample/src/BackendSample.tsx)
  * [x] backend-flow-endpoint
    * [Server  sample for **Backend flow**](merchant-integration-samples/backend-flow-endpoint/index.js)
* [x] Account-integration-sample
  * [Demonstrate how Account server integrate with OF system](account-integration-sample/index.js)
    * [Authenticate with OF by using Account Client Credential](account-integration-sample/utilities/getAccessToken.js)
    * Receive request create Transaction from OF system
    * [Approve Transaction: Notify OF system](account-integration-sample/utilities/approveTransaction.js)
    * [Cancel Transaction: Notify OF system](account-integration-sample/utilities/cancelTransaction.js)
    * Webhook to receive notification from OF system
