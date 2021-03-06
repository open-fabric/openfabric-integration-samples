import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { PaymentSuccessBase } from "../../../components/PaymentSuccessBase";
import { retrieveDataHook } from "../../../components/hooks/retrieveData";

const PaymentSuccess = () => {
  const [pgToken, setPGToken] = React.useState<string | null>(null);
  const { paymentInfo } = retrieveDataHook();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("txn_pg_token");
    if (token != null) {
      setPGToken(token);
    }
  }, []);

  return (
    <PaymentSuccessBase>
      {pgToken && (
        <div style={{ wordBreak: "break-all" }}>
          <b>Payment Gateway Token: </b>
          {pgToken || (paymentInfo && paymentInfo.data && paymentInfo.data.txn_pg_token)}
        </div>
      )}
      {!pgToken && !paymentInfo && (
        <div style={{ margin: 24 }}>
          <CircularProgress />
        </div>
      )}
    </PaymentSuccessBase>
  );
};

export default PaymentSuccess;
