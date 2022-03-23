import React, { useEffect } from "react";
import { Environment, OpenFabric } from "@openfabric/merchant-sdk";
import { CircularProgress } from "@mui/material";
import { env } from "../../../lib/variables";
import { PaymentSuccessBase } from "../../../components/PaymentSuccessBase";

const currentEnv: Environment =
  Environment[env as keyof typeof Environment] || Environment.dev;

const authHost = "/api/orchestrated/of-auth";

const PaymentSuccess = () => {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [pgToken, setPGToken] = React.useState<string | null>(null);

  useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const of_trace_id = queryParams.get("of_trace_id");

    if (!accessToken || !id) {
      return;
    }
    OpenFabric(accessToken)
      .setDebug(true)
      .setEnvironment(currentEnv)
      .processTransactionId(id, of_trace_id ?? undefined)
      .then(setPGToken);
  }, [accessToken]);

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
