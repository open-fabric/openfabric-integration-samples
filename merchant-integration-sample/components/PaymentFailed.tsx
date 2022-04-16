import { RestartBtn } from "./RestartBtn";
import React from "react";
export const PaymentFailed = () => {
  return (
    <div style={{
      marginTop: 128,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'lightgray',
        alignItems: "center",
        justifyContent: "center",
        width: 500,
        padding: 24,
        borderRadius: 8,
        filter: "drop-shadow(4px 4px 2px darkgrey)"
      }}>
        <h1 style={{color: 'red'}}>Payment Failed</h1>
        <RestartBtn title="Restart Backend Flow" path="backend"/>
        <RestartBtn title="Restart Payment Gateway Flow" path="pg"/>
      </div>
    </div>
  );
};
