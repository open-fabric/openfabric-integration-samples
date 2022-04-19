import React, { FunctionComponent } from "react";
import { RestartBtns } from "./RestartBtns";

export const PaymentSuccessBase: FunctionComponent = (props) => {
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
        {props.children}
        <RestartBtns/>
      </div>
    </div>
  );
};
