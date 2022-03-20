import axios from "axios";
import {
  of_api_url
} from "../../lib/variables";
import { GetAccessToken } from "../auth";
export const createEmbeddedTransaction = async ({
  transaction,
}) => {
  const { access_token } = await GetAccessToken();
  const result = await axios.post(`${of_api_url}/t/transactions`,transaction,{
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  }).catch(err => {
    console.log('=== err createEmbeddedTransaction', err)
    throw new Error("OF Server - Embedded Flow return error: " + err.message)
  })
  return result.data
};
