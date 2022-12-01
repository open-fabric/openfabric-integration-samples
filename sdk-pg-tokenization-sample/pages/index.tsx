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
const envString = process.env.NEXT_PUBLIC_ENV || 'dev'
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || "dev";

const OrderPage = () => {
  // initialize state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
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
    setOrder(getTransactionOrder(window.location.origin))
    fetch("/sdk-pg-tokenization/api/of-auth")
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
      `${window.location.origin}/sdk-pg-tokenization/success?merchant_ref=${order.partner_reference_id}`,
      `${window.location.origin}/sdk-pg-tokenization/failed?merchant_ref=${order.partner_reference_id}`
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
            ACME PAY
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
                {order && order.transaction_details.items.map((item: any) => (
                  <div
                    style={{
                      marginLeft: "20px",
                      marginRight: "20px",
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
                          <div style={{ width: "max-content"}}>
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
                <div style={{ marginTop: "20px" }}></div>
                {order && (
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
                )}

                <Typography variant="body1" gutterBottom style={{ color: "grey", marginTop: "20px" }}>
                  PG info
                </Typography>
                <hr style={{ borderTop: "1px dashed #bbb" }}></hr>
                <div style={{ marginTop: "20px" }}></div>
                {order && (
                  <div>
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
                        style={{ marginLeft: "50px" }}
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
                  style={{ height: "45px", width: "-webkit-fill-available", fontSize: "1.25rem", backgroundColor: "#004953", color: "white", textTransform: "none" }}
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
      </div >
    </div >
  );
}

// dummy data for the order
const getTransactionOrder = (baseUrl: string): any => {
  const partnerRefId = uuidv4();
  const address_line_1 = "30th Street corner 11th Avenue Bonifacio Global City, Lane P, Taguig, 1634 Metro Manila";
  const post_code = "1634";

  return {
    partner_reference_id: partnerRefId,
    partner_redirect_success_url: `${baseUrl}/sdk-pg-tokenization/success?merchant_ref=${partnerRefId}`,
    partner_redirect_fail_url: `${baseUrl}/sdk-pg-tokenization/failed?merchant_ref=${partnerRefId}`,
    pg_name: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_NAME || "xendit",
    pg_publishable_key: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY || "xnd_public_development_AZVI4iAxXD6fCgKzxhy1Rvr5obpIvKcJXNnXldhfjhJbWB7RDhwzakaf2dF3tQM",
    pg_flow: "tokenization",
    customer_info: {
      mobile_number: "+632 8855 8800",
      first_name: "John",
      email: "john.doe@gmail.com",
    },
    amount: 2100.50,
    currency: "PHP",
    transaction_details: {
      shipping_address: {
        country_code: "ph",
        address_line_1,
        post_code,
      },
      billing_address: {
        country_code: "ph",
        address_line_1,
        post_code,
      },
      items: [
        {
          item_id: "P100-1222",
          name: "iPhone",
          variation_name: "Black, 128GB",
          description: "string",
          quantity: 1,
          amount: 1,
          price: 2100.50,
          original_price: 2300,
          categories: ["phone"],
        }
      ]
    }
  }
}

export default OrderPage
