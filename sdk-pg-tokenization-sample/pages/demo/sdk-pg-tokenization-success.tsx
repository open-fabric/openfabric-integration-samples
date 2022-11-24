import React, { useEffect, useState } from "react";

const PaymentSuccess = (props: any) => {
  const title = props?.title ?? "Payment Success";
  const [transaction, setTransaction] = useState<any>({});

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let transactionData: any = {}
    queryParams.forEach((value, key) => {
      transactionData[key] = value
    });

    setTransaction(transactionData)
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
        {transaction && Object.keys(transaction).map(key => {
          return (
            <div style={{ alignItems: "left", display: "flex", flexDirection: "row" }}>
              <b style={{ flex: "1" }}>{key.replaceAll("_", " ")}:</b>
              <div style={{ flex: "2" }}>{transaction[key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentSuccess;
