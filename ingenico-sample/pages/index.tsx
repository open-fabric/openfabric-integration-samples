import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
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

const POSCheckoutPage = () => {
  // initialize state
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  // order change hook (amount, currency, pg_name, publishable_key change)
  const onOrderChange = (input: { propName: string; value: any }) => {
    let updatedOrder: any = {
      ...order,
    };

    if (input.propName.indexOf(".") > -1) {
      const propNameParts = input.propName.split(".");
      updatedOrder[propNameParts[0]][propNameParts[1]] = input.value;
    } else {
      updatedOrder[input.propName] = input.value;
    }

    setOrder(updatedOrder);
  };

  // get of access token
  React.useEffect(() => {
    setOrder(getTransactionOrder());
  }, []);

  // [BUY NOW] button click handler to trigger Open Fabric's payment method
  const onPayClick = async () => {
    setLoading(true);

    order.paymentAmount.amount =
      10 ** (cc.code(order.paymentAmount.currency)?.digits ?? 0) *
      order.paymentAmount.baseAmount;
    const transaction = await (
      await fetch("/ingenico-pos/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })
    ).json();

    window.location.href = `/ingenico-pos/transactions/${transaction.ppaasTransactionId}`;
  };

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
            ACME PAY
          </Typography>
          <div>
            <div>
              <div id="order-content">
                <Typography variant="subtitle1" gutterBottom>
                  POS Order
                </Typography>
                {order && (
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        marginLeft: "20px",
                        marginBottom: "10px",
                        color: "grey",
                        fontSize: "14px",
                        fontFamily:
                          '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                      }}
                    >
                      <TextField
                        fullWidth 
                        InputProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "12px",
                            padding: "5px 5px",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        type={"text"}
                        size="medium"
                        label="Description"
                        value={order.order.orderDescription}
                        onChange={(e) => {
                          onOrderChange({
                            propName: "order.orderDescription",
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: "20px",
                        color: "grey",
                        fontSize: "14px",
                        fontFamily:
                          '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                      }}
                    >
                      <TextField
                        InputProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "12px",
                            padding: "5px 5px",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        type={"number"}
                        size="small"
                        label="Amount"
                        value={order.paymentAmount.baseAmount}
                        onChange={(e) => {
                          const newAmount = parseFloat(e.target.value);
                          onOrderChange({
                            propName: "paymentAmount.baseAmount",
                            value: isNaN(newAmount) ? 0 : newAmount,
                          });
                        }}
                      />
                      <TextField
                        style={{ marginLeft: "50px" }}
                        InputProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "12px",
                            padding: "5px 5px",
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        type={"text"}
                        size="small"
                        label="Currency"
                        value={order.paymentAmount.currency}
                        onChange={(e) => {
                          onOrderChange({
                            propName: "paymentAmount.currency",
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    height: "45px",
                    width: "-webkit-fill-available",
                    fontSize: "1.25rem",
                    backgroundColor: "#004953",
                    color: "white",
                    textTransform: "none",
                  }}
                  disabled={loading}
                  onClick={onPayClick}
                >
                  {loading && (
                    <CircularProgress
                      size={20}
                      thickness={4}
                      color="secondary"
                    />
                  )}
                  {!loading && "Pay with ACME PAY"}
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

// dummy data for the order
const getTransactionOrder = (): any => {
  return {
    paymentType: "acmepay",
    paymentScenario: "consumerscan",
    serviceDomain: "apm",
    paymentAmount: {
      baseAmount: 50,
      currency: "SGD",
    },
    order: {
      orderId: uuidv4(),
      orderDescription: "Coffee @Starbucks",
    },
  };
};

export default POSCheckoutPage;
