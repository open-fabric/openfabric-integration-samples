import { TextField, Typography } from "@mui/material";
import { PGInput } from "./PGInput";

export const OrderSummary = (props: any) => {
  const {
    order,
    amount,
    currency,
    onAmountChange,
    onCurrencyChange,
    flow,
    onOrderChange,
  } = props;
  return (
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
              value={amount}
              onChange={onAmountChange}
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
              value={currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
      </div>
      {flow === "pg" && <PGInput order={order} onOrderChange={onOrderChange} />}
    </div>
  );
};
