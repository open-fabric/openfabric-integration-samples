import axios from "axios";
import qs from "qs";
import {
  merchant_client_secret,
  merchant_client_id,
  of_auth_url,
} from "../lib/variables";

export const OFAuthentication = async (scope?: string) => {
  const basic = Buffer.from(
    `${merchant_client_id}:${merchant_client_secret}`
  ).toString("base64");
  const body = qs.stringify({
    grant_type: "client_credentials",
    scope: scope || 'resources/transactions.read resources/transactions.create'
  });
  const response = await axios.post(of_auth_url, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${basic}`,
    },
  })
  return response.data;
};
