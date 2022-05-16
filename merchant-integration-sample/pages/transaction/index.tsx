import React from "react";
import { retrieveDataHook } from "../../components/hooks/retrieveData";
import { JsonDisplay } from "../../components/JsonDisplay";

const TransactionInfo = () => {
  const { paymentInfo } = retrieveDataHook();
  return (
    <div>
      {paymentInfo && (
        <JsonDisplay
          content={paymentInfo && paymentInfo.data}
          title={"Payment Info from webhook"}
        />
      )}
    </div>
  );
};

export default TransactionInfo;
