import axios from "axios";
import qs from "qs";
import {
  account_client_id,
  account_client_secrect,
  of_auth_url,
} from "../lib/variables.js";

export const GetAccessToken = async (scope) => {
  const basic = Buffer.from(
    `${account_client_id}:${account_client_secrect}`
  ).toString("base64");
  const body = qs.stringify({
    grant_type: "client_credentials",
    scope: scope || 'resources/transactions.read resources/transactions.create resources/transactions.update'
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
