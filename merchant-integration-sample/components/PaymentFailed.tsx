import React, {useEffect} from "react";
import { retrieveDataHook } from "./hooks/retrieveData";
import { RestartBtns } from "./RestartBtns";
import {isMobile} from "react-device-detect";

export const PaymentFailed = () => {
  const { paymentInfo } = retrieveDataHook();

  useEffect(() => {
    if (isMobile) {
      window.location.href = `openfabric://cancelled/${window.location.search}`;
    }
  }, [])

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
        <RestartBtns/>
      </div>
    </div>
  );
};
