import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import cc from "currency-codes";

const styles = {
  root: {
    display: "flex",
    flex: 1,
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
};

const TransactionPage = () => {
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>({});
  const transactionRef = useRef<any>({});

  const fetchData = async (ppaasTransactionId: string) => {
    if(transactionRef.current?.paymentStatus === "authorized" || transactionRef.current?.paymentStatus === "declined") {
      return;
    }
    
    const updatedTransaction = await (
      await fetch(`/ingenico-pos/api/transactions/${ppaasTransactionId}`)
    ).json();

    setTransaction(updatedTransaction);
  };

  // get transaction details
  React.useEffect(() => {
    transactionRef.current = transaction;
  });

  React.useEffect(() => {
    if(!router.isReady) return;

    const ppaasTransactionId = router.query.ppaasTransactionId as string;
    const intervalId = setInterval(() => {
      fetchData(ppaasTransactionId).catch(console.error);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [router.isReady]);

  // GUI
  return (
    <div
      style={{
        marginTop: "50px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={styles.root}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Order summary
          </Typography>
          <div
            style={{
              marginLeft: "20px",
              marginRight: "20px",
              color: "grey",
              fontFamily:
                '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            }}
          >
            <div style={{ width: "max-content" }}>
              <span style={{ fontWeight: "bold" }}>PPaaS Transaction ID</span>:{" "}
              {transaction.ppaasTransactionId}
            </div>
            <div style={{ width: "max-content" }}>
              <span style={{ fontWeight: "bold" }}>
                Provider Transaction ID
              </span>
              : {transaction.providerTransactionId}
            </div>
            <div style={{ width: "max-content" }}>
              <span style={{ fontWeight: "bold" }}>Order description</span>:{" "}
              {transaction.order?.orderDescription}
            </div>
            {transaction.paymentAmount && (
              <div style={{ width: "max-content" }}>
                <span style={{ fontWeight: "bold" }}>Order amount</span>:{" "}
                {transaction.paymentAmount.amount /
                  10 **
                    (cc.code(transaction.paymentAmount.currency)?.digits ??
                      0)}{" "}
                {transaction.paymentAmount.currency}
              </div>
            )}
          </div>
          {transaction.paymentStatus === "initializing" &&
            transaction.qrCodeConsumerScan && (
              <div>
                <Typography variant="h5" gutterBottom>
                  Scan to pay with ACME PAY
                </Typography>
                <iframe
                  src={transaction.qrCodeConsumerScan.codeValue}
                  style={{ minHeight: "200px" }}
                ></iframe>
              </div>
            )}
          {transaction.paymentStatus === "authorizing" && (
            <div>
              <Typography variant="h5" color="gray" gutterBottom>
                Transaction Processing...
              </Typography>
              <CircularProgress size={20} thickness={4} color="secondary" />
            </div>
          )}
          {transaction.paymentStatus === "authorized" && (
            <Typography variant="h5" color="green" gutterBottom>
              Transaction Approved
            </Typography>
          )}
          {transaction.paymentStatus === "declined" && (
            <Typography variant="h5" color="red" gutterBottom>
              Transaction Declined
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default TransactionPage;
