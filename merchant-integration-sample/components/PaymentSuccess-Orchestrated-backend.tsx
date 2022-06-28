import React, { useCallback, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { CardDetails } from "./CardDetails";
import { PaymentSuccessBase } from "./PaymentSuccessBase";
import { retrieveDataHook } from "./hooks/retrieveData";

export const PaymentSuccess = () => {
  const [cardDetails, setCardDetails] = React.useState<Object | null>(null);
  const { paymentInfo } = retrieveDataHook();

  const cardHandler = useCallback((card_fetch_token: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(`/api/orchestrated/backend-flow/fetch-card`, {
      method: "POST",
      headers: headers,
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
    const token = queryParams.get("txn_card_token") || (paymentInfo && paymentInfo.data && paymentInfo.data.txn_card_token);
    if (token != null ) {
      !cardDetails && cardHandler(token);
    }
  }, [cardHandler, paymentInfo]);

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
