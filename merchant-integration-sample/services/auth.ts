import axios from "axios";
import qs from "qs";
import {
  merchnat_client_secret,
  merchant_client_id,
  of_auth_url,
} from "../lib/variables";

export const OFAuthentication = async () => {
  const basic = Buffer.from(
    `${merchant_client_id}:${merchnat_client_secret}`
  ).toString("base64");
  const body = qs.stringify({
    grant_type: "client_credentials",
  });
  const response = await axios.post(of_auth_url, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${basic}`,
    },
  });
  return response.data;
};
