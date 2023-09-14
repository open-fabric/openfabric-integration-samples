import axios from "axios";
import { of_api_url } from "../../lib/variables.js";
import { GetAccessToken } from "../auth.js";
export const createEmbeddedTransaction = async ({ transaction }) => {
  const { access_token } = await GetAccessToken();
  const result = await axios.post(`${of_api_url}/t/transactions`, transaction, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return result.data;
};
