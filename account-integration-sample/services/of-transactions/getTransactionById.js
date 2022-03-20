import axios from "axios";
import {
  of_api_url
} from "../../lib/variables";
import { GetAccessToken } from "../auth";

export const GetTransactionById = async ({ transaction_id }) => {
  const { access_token } = await GetAccessToken();
  const response = await axios.get(`${of_api_url}/t/transactions/${transaction_id}`,{
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    }
  })
  return response.data
};

