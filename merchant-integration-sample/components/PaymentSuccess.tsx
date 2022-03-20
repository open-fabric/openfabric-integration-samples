import React, { useCallback, useEffect } from "react";
import { RestartBtn } from "./RestartBtn";
import { Environment, OpenFabric } from "@open-fabric/slice-merchant-sdk";
import { CircularProgress } from "@mui/material";
import { CardDetails } from "./CardDetails";

const envString = process.env.REACT_APP_ENV || "dev";
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || Environment.dev;
const authHost = "/api/fill-flow/of-auth";

export const PaymentSuccess = () => {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [cardDetails, setCardDetails] = React.useState<Object | null>(null);

  useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  const cardHandler = useCallback((card_fetch_token: string) => {
    fetch("http://localhost:8080/fetch-card-details", {
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
    <div
      style={{
        marginTop: 128,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "lightgray",
          alignItems: "center",
          justifyContent: "center",
          width: 500,
          padding: 24,
          borderRadius: 8,
          filter: "drop-shadow(4px 4px 2px darkgrey)",
        }}
      >
        <h1 style={{ color: "green", marginBottom: 32 }}>Payment Success</h1>
        {cardDetails ? (
          <CardDetails cardDetails={cardDetails} />
        ) : (
          <div style={{ margin: 24 }}>
            <CircularProgress />
          </div>
        )}
        <RestartBtn title="Restart Fill Flow" path="" />
        <RestartBtn title="Restart Backend Flow" path="backend" />
        <RestartBtn title="Restart Payment Gateway Flow" path="pg" />
      </div>
    </div>
  );
};
