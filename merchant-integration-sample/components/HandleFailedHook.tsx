import { useCallback, useEffect } from "react";

export const FailedHook = (props: {
  failedUrl: string
}) => {
  const failedTransaction = useCallback(() => {
    setTimeout(() => {
      window.location.href = `${window.location.origin}${props.failedUrl}`;
    }, 2000);
  }, []);
  const callback = useCallback(
    (mutationsList: any, observer: any) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.target &&
          mutation.target.id === "openfabric-message" &&
          mutation.target.children &&
          mutation.target.children[0] &&
          mutation.target.children[0].innerHTML ===
            "We did not get an approval for this transaction. Try other payment methods."
        ) {
          failedTransaction();
        }
      }
    },
    [failedTransaction]
  );

  useEffect(() => {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    const targetNode = document.body;
    targetNode && observer.observe(targetNode, config);
    return () => {
      observer.disconnect();
    };
  }, [callback]);
};
