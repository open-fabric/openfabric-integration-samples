import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  OpenFabric,
  Environment,
  FlowType,
} from "@open-fabric/slice-merchant-sdk";
import { FailedHook } from "./HandleFailedHook";
import { payment_methods, env } from "../lib/variables";
import { OrderSummary } from "./OrderSummary";
import { OrderSummaryDataHook } from "./hooks/orderSummaryData";

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
  Environment[envString as keyof typeof Environment] ||
  (envString === "prod" ? Environment.production : Environment.dev);
const paymentMethods = payment_methods || "";
export const PGSample = () => {
  FailedHook({
    failedUrl: `/orchestrated/pg-sample/payment-failed`,
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
  } = OrderSummaryDataHook({ flow: "pg" });

  React.useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const sdkConfig = {
      access_token: accessToken,
      merchant_result_url: `${window.location.origin}/orchestrated/pg-sample/payment-success?merchant_ref=${merchant_reference_id}`,
      merchant_cancel_url: `${window.location.origin}/orchestrated/pg-sample/payment-failed?merchant_ref=${merchant_reference_id}`,
      payment_methods: [paymentMethods],
      enviroment: currentEnv,
      flow_type: FlowType.redirect,
      debug: true,
    };
    const openFabric = OpenFabric(sdkConfig);
    openFabricRef.current = openFabric;
    openFabric.initialize().then(() => {
      setLoading(false);
    });
  }, [accessToken]);

  const onPayClick = () => {
    setLoading(true);
    fetch("/api/orchestrated/checkout", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(order),
    }).then((response) => {
      openFabricRef.current.createOrder(order);
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
          <Typography variant="h5" gutterBottom>
            Payment Gateway Experience
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
                  size="small"
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
