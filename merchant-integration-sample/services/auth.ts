import axios from "axios";
import qs from "qs";
import {
  of_auth_url,
} from "../lib/variables";

export const OFAuthentication = (id: string, secret: string) => async (scope?: string, ) => {
  const basic = Buffer.from(
    `${id}:${secret}`
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
