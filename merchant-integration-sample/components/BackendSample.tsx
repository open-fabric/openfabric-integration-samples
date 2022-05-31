import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
// @ts-ignore
import { OpenFabric, Environment } from "@openfabric/merchant-sdk";
import { faker } from "@faker-js/faker";
import { FailedHook } from "./HandleFailedHook";
import { payment_methods, env } from "../lib/variables";
import { OrderSummaryDataHook } from "./hooks/orderSummaryData";
import { OrderSummary } from "./OrderSummary";

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

const currentEnv: Environment =
Environment[env as keyof typeof Environment] || (env === 'prod' ? Environment.production : Environment.dev);
const paymentMethods = payment_methods || "";
const authHost = "/api/orchestrated/of-auth";
export const BackendSample = () => {
  FailedHook({
    failedUrl: `/orchestrated/backend-sample/payment-failed`,
  });
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const payBtn = useRef(null);
  const openFabricRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  const {
    amount,
    currency,
    order,
    merchant_reference_id,
    onAmountChange,
    onCurrencyChange,
  } = OrderSummaryDataHook({flow: 'backend'});

  React.useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const merchant_reference_id = `MT${Date.now()}`;

    const openFabric = OpenFabric(
      accessToken,
      `${window.location.origin}/orchestrated/backend-sample/payment-success?merchant_ref=${merchant_reference_id}`,
      `${window.location.origin}/orchestrated/backend-sample/payment-failed?merchant_ref=${merchant_reference_id}`
    )
      .setDebug(true)
      .setEnvironment(currentEnv)
      .setPaymentMethods([paymentMethods]);

    openFabric.createOrder(order);
    openFabric.initialize().then(() => {
      setLoading(false);
    });
    openFabricRef.current = openFabric;
  }, [accessToken]);

  useEffect(() => {
    openFabricRef &&
      openFabricRef.current &&
      openFabricRef.current.createOrder(order);
  }, [order]);

  const onPayClick = () => {
    setLoading(true);
    fetch("/api/orchestrated/checkout", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(openFabricRef.current.transactionRequest),
    }).then((response) => {
      openFabricRef.current.startFlow();
    });
  };
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
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom style={{ textAlign: "center" }}>
            Backend Experience
          </Typography>
          <div>
            <div>
            <OrderSummary
                amount={amount}
                currency={currency}
                order={order}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
              />
              <div
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{ width: "160px", height: "36px", fontSize: "14px" }}
                  disabled={loading || !order.currency || !order.amount}
                  ref={payBtn}
                  onClick={onPayClick}
                >
                  {loading && (
                    <CircularProgress
                      size={20}
                      thickness={4}
                      color="secondary"
                    />
                  )}
                  {!loading && "Buy Now"}
                </Button>
                <div style={{ width: "10px" }} />
                <Button
                  id="submit-button"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setTimeout(() => {
                      window.location.href = `${window.location.origin}/orchestrated/backend-sample/payment-success`;
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
