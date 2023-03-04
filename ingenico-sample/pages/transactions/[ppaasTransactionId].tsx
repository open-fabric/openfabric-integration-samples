import React, { useState } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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
  const ppaasTransactionId = router.query.ppaasTransactionId as string;
  const [transaction, setTransaction] = useState<any>({});
  const fetchData = async () => {
    const transaction = await (
      await fetch(`/ingenico-pos/api/transactions/${ppaasTransactionId}`)
    ).json();

    setTransaction(transaction);
  };

  // get transaction details
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData().catch(console.error);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
          <Typography variant="subtitle1" gutterBottom>
            Order summary
          </Typography>
          {transaction.paymentStatus === "initializing" &&
            transaction.qrCodeConsumerScan && (
              <div>
                <Typography variant="h5" gutterBottom>
                  Scan to pay with ACME PAY
                </Typography>
                <iframe src={transaction.qrCodeConsumerScan.codeValue}></iframe>
              </div>
            )}
          {transaction.paymentStatus === "authorizing" && (
            <CircularProgress size={20} thickness={4} color="secondary" />
          )}
          {transaction.paymentStatus === "authorized" && (
            <Typography variant="h3" color="green" gutterBottom>
              Transaction Approved
            </Typography>
          )}
          {transaction.paymentStatus === "declined" && (
            <Typography variant="h3" color="red" gutterBottom>
              Transaction Declined
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default TransactionPage;
