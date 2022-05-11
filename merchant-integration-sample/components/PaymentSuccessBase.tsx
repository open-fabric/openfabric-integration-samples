import React, { FunctionComponent, useEffect } from "react";
import { RestartBtns } from "./RestartBtns";

export const PaymentSuccessBase: FunctionComponent = (props) => {
  const [ofAmount, setOfAmount] = React.useState<string>();
  const [ofCurrency, setOfcurrency] = React.useState<string>();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const amount = queryParams.get("txn_app_amt");
    const currency = queryParams.get("txn_app_ccy");
    currency && setOfcurrency(currency);
    amount && setOfAmount(amount);
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
          alignItems: "center",
          justifyContent: "center",
          width: 500,
          padding: 24,
          borderRadius: 8,
          filter: "drop-shadow(4px 4px 2px darkgrey)",
        }}
      >
        <h1 style={{ color: "green", marginBottom: 32 }}>Payment Success</h1>
        {ofCurrency && (
          <div style={{ wordBreak: "break-all" }}>
            <b>Approved Currency:</b>
            {ofCurrency}
          </div>
        )}
        {ofAmount && (
          <div style={{ wordBreak: "break-all" }}>
            <b>Approved Amount:</b>
            {ofAmount}
          </div>
        )}
        {props.children}
        <RestartBtns />
      </div>
    </div>
  );
};
