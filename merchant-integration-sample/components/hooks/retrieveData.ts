import { useEffect, useState } from "react";

export const retrieveDataHook = () => {
  const [paymentInfo, setPaymentInfo] = useState<any>();
  useEffect(() => {
    if (!window || !window.location) {
      return;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const merchantRefId = queryParams.get("merchant_ref");
    fetch(`/api/orchestrated/transaction/${merchantRefId}`)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((data) => {
        console.log("=== data from Webhook", data && data.webhook);
        data && data.webhook && setPaymentInfo(data.webhook);
      })
      .catch((error) => {
        console.log("error", error);
        return "";
      });
  }, []);
  return { paymentInfo };
};
