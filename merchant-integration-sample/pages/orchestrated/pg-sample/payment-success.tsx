import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { PaymentSuccessBase } from "../../../components/PaymentSuccessBase";
import { retrieveDataHook } from "../../../components/hooks/retrieveData";
import { JsonDisplay } from "../../../components/JsonDisplay";
import Divider from '@mui/material/Divider';

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
          {pgToken}
        </div>
      )}
      <Divider/>
      {paymentInfo && (
        <JsonDisplay
          content={paymentInfo && paymentInfo.data}
          title={"Payment Info from webhook"}
        />
      )}
      <Divider/>
      {!pgToken && !paymentInfo && (
        <div style={{ margin: 24 }}>
          <CircularProgress />
        </div>
      )}
    </PaymentSuccessBase>
  );
};

export default PaymentSuccess;
