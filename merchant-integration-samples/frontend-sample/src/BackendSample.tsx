import React, { useEffect} from "react";
import {Theme, createStyles, makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// @ts-ignore
import {OpenFabric, Environment} from "@openfabric/merchant-sdk";

import * as faker from "faker";
import {FailedHook} from "./HandleFailedHook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flex: 1,
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
    },
    paper: {
      padding: "20px",
    },
    form: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

const authHost = "/of-auth";
const paymentMethods = process.env.REACT_APP_PAYMENT_METHODS || "";
const envString = process.env.REACT_APP_ENV || "dev";
const currentEnv: Environment =
  Environment[envString as keyof typeof Environment] || Environment.dev;

const customer_info = {
  mobile_number: faker.phone.phoneNumber("!##-!##-####"),
  first_name: faker.name.firstName(),
  email: faker.internet.email(),
};
const item = {
  item_id: "P100-1222",
  name: "iPhone",
  variation_name: "Black, 128GB",
  description: "string",
  quantity: 1,
  amount: 1,
  price: 2300,
  original_price: 2000,
  tax_amount_percent: 3,
  categories: ["phone"],
};

const address_line_1 = faker.address.streetAddress();
const post_code = faker.address.zipCode("###");
const shipping_address = {
  country_code: "sg",
  address_line_1,
  post_code,
  self_pickup: true,
};

const billing_address = {
  country_code: "sg",
  address_line_1,
  post_code,
};

const merchant_reference_id = `MT${Date.now()}`;

export const BackendSample = () => {
  const classes = useStyles();
  FailedHook();
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(authHost)
      .then((response) => response.json())
      .then(({access_token}) => {
        if (!access_token) {
          console.error("Failed to fetch accessToken");
          return;
        }
        setAccessToken(access_token);
      })
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const openFabric = OpenFabric(accessToken, `${window.location}/PaymentSuccess`, `${window.location}/PaymentFailed`)
      .setDebug(true)
      .setEnvironment(currentEnv)
      .setPaymentMethods([paymentMethods]);

    openFabric.createOrder(
      {
        customer_info,
        amount: 2300,
        currency: "SGD",
        merchant_reference_id,
        transaction_details: {
          shipping_address,
          billing_address,
          items: [item],
          tax_amount_percent: 10,
          shipping_amount: 10,
          original_amount: 130
        },
      }
    )
    openFabric.renderButton("bnpl-button");
    openFabric.initialize();
  }, [accessToken]);

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
      <div className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Backend Experience
          </Typography>
          <div>
            <div className={classes.form}>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="example2-address"
                  label="Address"
                  autoComplete="address-line1"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="example2-city"
                  label="City"
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="example2-state"
                  label="State"
                  autoComplete="address-level1"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="example2-zip"
                  label="ZIP"
                  autoComplete="postal-code"
                />
              </div>

              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="cardnumber"
                  name="cardnumber"
                  label="Card number"
                />
              </div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="exp-date"
                  name="exp-date"
                  label="Expiration"
                />
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  id="cvc"
                  name="cvc"
                  label="CVC"
                />
              </div>
              <div
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  id="bnpl-button"
                  style={{width: "160px", height: "36px"}}
                />
                <div style={{width: "10px"}}/>
                <Button
                  id="submit-button"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={true}
                  onClick={() => {
                    setTimeout(() => {
                      window.location.href = `${window.location.origin}/PaymentSuccess`;
                    }, 200);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

