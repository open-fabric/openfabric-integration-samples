import { asyncRequest } from "./asyncRequest";
import {
  account_client_id,
  account_client_secret,
  env,
  of_auth_url,
} from "./variables";
const auth = Buffer.from(
  `${account_client_id}:${account_client_secret}`
).toString("base64");
const authOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    /*
     * Authorization header is base64 encoded value
     * of your clientId and clientSecret
     */
    Authorization: `Basic ${auth}`,
  },
  form: {
    grant_type: "client_credentials",
    scope: `${env}-resources/transactions.read ${env}-resources/transactions.write`,
  },
};
export const getAccessToken = async () => {
  return asyncRequest(of_auth_url, authOptions);
};
