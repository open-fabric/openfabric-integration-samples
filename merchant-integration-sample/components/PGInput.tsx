import { Typography, TextField } from "@mui/material";

export const PGInput = (props: any) => {
  const { onOrderChange, order } = props;
  return (
    <>
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
          fontSize: "14px",
          fontFamily:
            '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        <div id="left" style={{ flex: "1" }}>
          <TextField
            label="PG Name"
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
              shrink: true,
              style: {
                fontSize: "12px",
              },
            }}
            type={"string"}
            value={order.pg_name}
            onChange={(e) => {
              const pgName = e.target.value;
              onOrderChange({
                propName: "pg_name",
                value: pgName,
              });
            }}
          />
          <div style={{ paddingTop: "20px" }}>
            <TextField
              label="PG Publishable key - (optional)"
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
                shrink: true,
                style: {
                  fontSize: "12px",
                },
              }}
              type={"string"}
              fullWidth
              multiline
              value={order.pg_publishable_key}
              onChange={(e) => {
                const pg_publishable_key = e.target.value;
                onOrderChange({
                  propName: "pg_publishable_key",
                  value: pg_publishable_key,
                });
              }}
            />
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};
