import React from "react";
import { retrieveDataHook } from "../../components/hooks/retrieveData";

const TransactionInfo = () => {
  const { paymentInfo } = retrieveDataHook();
  return (
    <div>
      <pre>
        {JSON.stringify(paymentInfo)}
      </pre>
    </div>
  );
};

export default TransactionInfo;
