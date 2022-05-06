import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// @ts-ignore
import {
  OpenFabric,
  Environment,
} from "@openfabric/merchant-sdk";
import { faker } from "@faker-js/faker";
import { FailedHook } from "./HandleFailedHook";
import { payment_methods, env, payment_gateway_name, payment_gateway_publish_key } from "../lib/variables";

const styles = {
  root: {
    display: "flex",
    flex: 1,
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
};

const authHost = "/api/orchestrated/of-auth";
const envString = env || "sandbox";
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || Environment.dev;
const paymentMethods = payment_methods || "";

const customer_info = {
  mobile_number: faker.phone.phoneNumber("!##-!##-####"),
  first_name: faker.name.firstName(),
  email: faker.internet.email(),
};
const item = {
  item_id: "P100-1222",
  name: "iPhone",
  variation_name: "Black, 128GB",
  description: "string",
  quantity: 1,
  amount: 1,
  price: 2300,
  original_price: 2000,
  tax_amount_percent: 3,
  categories: ["phone"],
};

const address_line_1 = faker.address.streetAddress();
const post_code = faker.address.zipCode("###");
const shipping_address = {
  country_code: "sg",
  address_line_1,
  post_code,
  self_pickup: true,
};

const billing_address = {
  country_code: "sg",
  address_line_1,
  post_code,
};

const merchant_reference_id = `MT${Date.now()}`;
export const PGSample = () => {
  FailedHook({
    failedUrl: `/orchestrated/pg-sample/payment-failed`
  });
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const openFabric = OpenFabric(
      accessToken,
      `${window.location.origin}/orchestrated/pg-sample/payment-success`,
      `${window.location.origin}/orchestrated/pg-sample/payment-failed`
    )
      .setDebug(true)
      .setEnvironment(currentEnv)

    openFabric.setPaymentMethods([paymentMethods]);
    openFabric.createOrder({
      customer_info,
      amount: 230,
      currency: "SGD",
      merchant_reference_id,
      transaction_details: {
        shipping_address,
        billing_address,
        items: [item],
        tax_amount_percent: 10,
        shipping_amount: 10,
        original_amount: 130,
      },
      pg_publishable_key: payment_gateway_publish_key,
      pg_name: payment_gateway_name,
    });
    openFabric.renderButton("bnpl-button");
    openFabric.initialize();
  }, [accessToken]);

  return (
    <div
      style={{
        marginTop: "50px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={styles.root}>
        <Paper elevation={3}style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Payment Gateway Experience
          </Typography>
          <div>
            <div>
            <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="example2-address"
                  label="Address"
                  autoComplete="address-line1"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="example2-city"
                  label="City"
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="example2-state"
                  label="State"
                  autoComplete="address-level1"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="example2-zip"
                  label="ZIP"
                  autoComplete="postal-code"
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="cardnumber"
                  name="cardnumber"
                  label="Card number"
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="exp-date"
                  name="exp-date"
                  label="Expiration"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ margin: "10px", textAlign: "left" }}
                  required
                  id="cvc"
                  name="cvc"
                  label="CVC"
                />
              </div>

              <div
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  id="bnpl-button"
                  style={{ width: "160px", height: "36px" }}
                />
                <div style={{ width: "10px" }} />
                <Button
                  id="submit-button"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={true}
                  onClick={() => {
                    setTimeout(() => {
                      window.location.href = `${window.location.origin}/pg-sample/payment-success`;
                    }, 200);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};
