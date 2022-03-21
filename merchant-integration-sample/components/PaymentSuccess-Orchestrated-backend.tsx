import React, { useCallback, useEffect } from "react";
import { RestartBtn } from "./RestartBtn";
import { Environment, OpenFabric } from "@openfabric/merchant-sdk";
import { CircularProgress } from "@mui/material";
import { CardDetails } from "./CardDetails";
import { env, of_auth_url } from "../lib/variables";
import { PaymentSuccessBase } from "./PaymentSuccessBase";
const envString = env;
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || Environment.dev;
export const PaymentSuccess = () => {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [cardDetails, setCardDetails] = React.useState<Object | null>(null);
  const authHost = "/api/orchestrated/of-auth";

  useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  const cardHandler = useCallback((card_fetch_token: string) => {
    fetch(`/api/orchestrated/backend-flow/fetch-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer anymerchanttoken`,
      },
      body: JSON.stringify({ card_fetch_token }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((result) => {
        const cardDetails = JSON.stringify(result);
        const message = "Card details from backend: " + cardDetails;
        console.log(message);
        setCardDetails(result);
      })
      .catch((error) => {
        console.log("Failed to fetch card details from the backend:", error);
      });
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const of_trace_id = queryParams.get("of_trace_id");

    if (!accessToken || !id) {
      return;
    }
    const openFabric = OpenFabric(accessToken)
      .setDebug(true)
      .setEnvironment(currentEnv);

    openFabric
      .processTransactionId(id, of_trace_id ?? undefined)
      .then((token) => {
        cardHandler(token);
      });
  }, [accessToken, cardHandler]);

  return (
    <PaymentSuccessBase>
      {cardDetails ? (
        <CardDetails cardDetails={cardDetails} />
      ) : (
        <div style={{ margin: 24 }}>
          <CircularProgress />
        </div>
      )}
    </PaymentSuccessBase>
  );
};
