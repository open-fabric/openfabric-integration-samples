import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
// @ts-ignore
import { OpenFabric, Environment } from "@openfabric/merchant-sdk";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid"

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

// get env
const envString = 'dev'
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || "dev";

const PGPage = () => {
  // initialize state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(getTransactionOrder());
  // order change hook (amount, currency, pg_name, publishable_key change)
  const onOrderChange = (input: { propName: string; value: any }) => {
    let updatedOrder: any = {
      ...order,
      [input.propName]: input.value
    }

    setOrder(updatedOrder)
  };

  // get of access token
  React.useEffect(() => {
    fetch("/api/of-auth")
      .then((response) => response.json())
      .then(({ access_token }) => setAccessToken(access_token));
  }, []);

  // [BUY NOW] button click handler to trigger Open Fabric's payment method
  const onPayClick = async () => {
    if (!accessToken) {
      return;
    }

    setLoading(true);

    // initialize Open Fabric's SDK
    const openFabric = OpenFabric(
      accessToken,
      `${window.location.origin}/orchestrated/pg-sample/payment-success?merchant_ref=${order.partner_reference_id}`,
      `${window.location.origin}/orchestrated/pg-sample/payment-failed?merchant_ref=${order.partner_reference_id}`
    )
      .setDebug(true)
      .setEnvironment(currentEnv);

    openFabric.createOrder(order);
    await openFabric.initialize();

    // start payment flow
    openFabric.startFlow();
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
            Payment Gateway Experience
          </Typography>
          <div>
            <div>
              <div id="order-content">
                <Typography variant="subtitle1" gutterBottom>
                  Order summary
                </Typography>
                <Typography variant="body1" gutterBottom style={{ color: "grey" }}>
                  Items
                </Typography>
                <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                {order.transaction_details.items.map((item: any) => (
                  <div
                    style={{
                      marginLeft: "20px",
                      color: "grey",
                      fontFamily:
                        '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {item.name}
                    </div>
                    <div
                      style={{
                        paddingLeft: "50%",
                        letterSpacing: "0px",
                        fontSize: "12px",
                      }}
                    >
                      {Object.keys(item).map((k, idx) => {
                        return (
                          <div>
                            <span style={{ fontWeight: "bold" }}>
                              {k.replaceAll("_", " ")}
                            </span>
                            : {item && item[k].toString()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <Typography variant="body1" gutterBottom style={{ color: "grey" }}>
                  Fee
                </Typography>
                <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    marginLeft: "20px",
                    color: "grey",
                    fontSize: "14px",
                    fontFamily:
                      '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  }}
                >
                  <div id="left" style={{ flex: "1" }}>
                    <div>Original amount:</div>
                    <div>Shipping amount:</div>
                    <div>Tax amount percent:</div>
                    <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                    <div></div>
                    <div></div>
                  </div>
                  <div id="right" style={{ flex: "1" }}>
                    <div>{order.transaction_details.original_amount}</div>
                    <div>{order.transaction_details.shipping_amount}</div>
                    <div>{order.transaction_details.tax_amount_percent} %</div>
                    <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                    <div style={{ display: "flex" }}>
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
                        value={order.amount}
                        onChange={e => {
                          const newAmount = parseFloat(e.target.value);
                          onOrderChange(
                            {
                              propName: "amount",
                              value: isNaN(newAmount) ? 0 : newAmount
                            }
                          )
                        }}
                      />

                      <TextField
                        style={{ marginLeft: "20px" }}
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
                        value={order.currency}
                        onChange={e => {
                          onOrderChange(
                            {
                              propName: "currency",
                              value: e.target.value
                            }
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Typography variant="body1" gutterBottom style={{ color: "grey" }}>
                  PG info
                </Typography>
                <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    marginLeft: "20px",
                    marginTop: "20px",
                    color: "grey",
                    fontSize: "12px",
                    fontFamily:
                      '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  }}>
                  <TextField
                    label="PG Flow"
                    inputProps={{
                      style: {
                        fontSize: "12px",
                        padding: "5px 5px",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: "12px",
                      },
                    }}
                    type={"string"}
                    value={order.pg_flow}
                    contentEditable={false}
                    disabled={true}
                  />
                  <TextField
                    style={{ marginLeft: "70px" }}
                    label="PG Name"
                    inputProps={{
                      style: {
                        fontSize: "12px",
                        padding: "5px 5px",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: "12px",
                      },
                    }}
                    type={"string"}
                    value={order.pg_name}
                    onChange={e => {
                      onOrderChange(
                        {
                          propName: "pg_name",
                          value: e.target.value
                        }
                      )
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    marginLeft: "20px",
                    marginTop: "20px",
                    color: "grey",
                    fontSize: "14px",
                    fontFamily:
                      '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  }}
                >
                  <div id="left" style={{ flex: "1" }}>

                    <div style={{ paddingTop: "20px" }}>
                      <TextField
                        label="PG Publishable key - (optional)"
                        inputProps={{
                          style: {
                            fontSize: "12px",
                            padding: "5px 5px",
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontSize: "12px",
                          },
                        }}
                        type={"string"}
                        fullWidth
                        multiline
                        value={order.pg_publishable_key}
                        onChange={e => {
                          onOrderChange(
                            {
                              propName: "pg_publishable_key",
                              value: e.target.value
                            }
                          )
                        }}
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
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
                  style={{ width: "160px", height: "36px", fontSize: "14px" }}
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
                  {!loading && "Buy Now"}
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}

// dummy data for the order
const getTransactionOrder = (): any => {
  const partnerRefId = uuidv4();

  return {
    partner_reference_id: partnerRefId,
    partner_redirect_success_url: `https://merchant-1.samples.dev.openfabric.co/orchestrated/pg-sample/payment-success?merchant_ref=${partnerRefId}`,
    partner_redirect_fail_url: `https://merchant-1.samples.dev.openfabric.co/orchestrated/pg-sample/payment-failed?merchant_ref=${partnerRefId}`,
    pg_name: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_NAME || "xendit",
    pg_publishable_key: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY || "xnd_public_development_AZVI4iAxXD6fCgKzxhy1Rvr5obpIvKcJXNnXldhfjhJbWB7RDhwzakaf2dF3tQM",
    pg_flow: "tokenization",
    customer_info: {
      mobile_number: "+6587654321",
      first_name: "BNPL",
      last_name: "Developer",
      email: "developer@bnpl1.com"
    },
    amount: 50000,
    currency: "PHP",
    transaction_details: {
      shipping_address: {
        country: "Singapore",
        country_code: "SG",
        address_line_1: "80 Robinson Road",
        address_line_2: "#09-01",
        address_line_3: "#09-01",
        post_code: "068898"
      },
      billing_address: {
        country: "Singapore",
        country_code: "SG",
        address_line_1: "80 Robinson Road",
        address_line_2: "#09-01",
        address_line_3: "#09-01",
        post_code: "068898"
      },
      items: [
        {
          item_id: "P100",
          name: "iPhone",
          price: 11020,
          quantity: 1,
          variation_name: "Black, 128GB",
          original_price: 12020,
          categories: [
            "Electronics"
          ]
        },
        {
          item_id: "P101",
          name: "iPhone SE case",
          price: 1000,
          quantity: 1,
          variation_name: "White",
          categories: [
            "Accessories"
          ]
        }
      ],
      tax_amount_percent: 3,
      shipping_amount: 1020,
      original_amount: 13020
    }
  }
}

export default PGPage