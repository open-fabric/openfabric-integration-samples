import React, { useCallback, useEffect } from "react";

const PaymentSuccess = (props: any) => {
  const title = props?.title ?? "Payment Success";
  const [cardDetails, setCardDetails] = React.useState<any>(null);

  const cardHandler = useCallback((card_fetch_token: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(`/api/fetch-card`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ card_fetch_token }),
    })
      .then((response) => response.json())
      .then((result) => {
        setCardDetails(result);
      })
      .catch((error) => {
        console.log("Failed to fetch card details from the backend:", error);
      });
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("txn_card_token");

    token && !cardDetails && cardHandler(token);
  }, []);

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
          justifyContent: "center",
          width: 500,
          padding: 24,
          borderRadius: 8,
          filter: "drop-shadow(4px 4px 2px darkgrey)",
        }}
      >
        <h1 style={{ color: "green", marginBottom: 32, textAlign: "center" }}>{title}</h1>
        {cardDetails && Object.keys(cardDetails).map(key => {
          return (
            <div style={{ alignItems: "left", display: "flex", flexDirection: "row" }}>
              <b style={{ flex: "1" }}>{key.replaceAll("_", " ")}:</b>
              <div style={{ flex: "2" }}>{cardDetails[key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentSuccess;
