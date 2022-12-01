import React, { useCallback, useEffect, useState } from "react";

const PaymentSuccess = (props: any) => {
  const title = props?.title ?? "Payment Success";
  const [transaction, setTransaction] = useState<any>({});
  const [cardDetails, setCardDetails] = useState<any>(null);

  const cardHandler = useCallback((card_fetch_token: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(`/sdk-card/api/fetch-card`, {
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

    // get transaction data
    let transactionData: any = {}
    queryParams.forEach((value, key) => {
      transactionData[key] = value
    });
    setTransaction(transactionData)

    // fetch card info
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
        <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
        {transaction && Object.keys(transaction).map(key => {
          return (
            <div style={{ alignItems: "left", display: "flex", flexDirection: "row", overflowWrap: "anywhere" }}>
              <b style={{ flex: "1" }}>{key.replaceAll("_", " ")}:</b>
              <div style={{ flex: "2" }}>{transaction[key]}</div>
            </div>
          );
        })}
        {cardDetails && (
          <div>
            <hr style={{ borderTop: "1px dashed red", width: "-webkit-fill-available" }}></hr>
            {Object.keys(cardDetails).map(key => {
              return (
                <div style={{ alignItems: "left", display: "flex", flexDirection: "row" }}>
                  <b style={{ flex: "1" }}>{key.replaceAll("_", " ")}:</b>
                  <div style={{ flex: "2" }}>{cardDetails[key]}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
