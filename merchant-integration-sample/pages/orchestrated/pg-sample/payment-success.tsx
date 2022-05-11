import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { PaymentSuccessBase } from "../../../components/PaymentSuccessBase";

const PaymentSuccess = () => {
  const [pgToken, setPGToken] = React.useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("txn_pg_token");
    if (token != null) {
      setPGToken(token);
    }
  }, []);

  return (
    <PaymentSuccessBase>
      {pgToken ? (
        <div style={{wordBreak: 'break-all'}}>
          <b>Payment Gateway Token:</b>{pgToken}
        </div>
      ) : (
        <div style={{ margin: 24 }}>
          <CircularProgress />
        </div>
      )}
    </PaymentSuccessBase>
  );
};

export default PaymentSuccess;
