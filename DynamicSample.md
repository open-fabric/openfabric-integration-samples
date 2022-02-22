# End-to-end account & merchant sample

A sample to demonstrate end to end integration between ****Merchants**** & ****Accounts****

## Prerequisites and setup

* [Docker](https://www.docker.com/products/overview)
* [Docker Compose](https://docs.docker.com/compose/overview/) - v2.2.3 or higher
* **Node.js** v16.0.0 or higher

## Running the sample program

### Step 1: Update env file

Create .env file in the root of folder, according to your input Account/Merchant credential - you can check the .sample.env file for more details

```bash
ACCOUNT_CLIENT_ID=<your account client id credential>
ACCOUNT_CLIENT_SECRET=<your account client secret credential>
MERCHANT_CLIENT_ID=<your merchant client id credential, must be the merchant of your account>
MERCHANT_CLIENT_SECRET=<your merchant client secret credential, must be the merchant of your account >
PAYMENT_METHODS=<your account slug>
```

**Note:**
- Merchant credential could be found in your Open Fabric Portal

*Some additional config value if you want to try ***PGToken Flow****

```bash
PAYMENT_GATEWAY_PUBLISH_KEY=<Your merchant PG publish key>
PAYMENT_GATEWAY_NAME=<your merchant PG name, e.g: Xendit>
```

### Step 2: Run your sample

```bash
sh start.sh
```

Open <http://localhost:3000> on your browser

Experience is ready to use.
