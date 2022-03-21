import axios from "axios";
import {
  account_api_url,
} from "../lib/variables";
import { addNewTransaction } from "../db";
export const Checkout = async (transaction: any) => {
  const merchantTrans = { ...transaction, status: "Created" };
  addNewTransaction(merchantTrans);
  const response = await submitTransToAccountServer(merchantTrans);
  return response.data;
};

const submitTransToAccountServer = (merchantTrans: any) => {
  return axios.post(`${account_api_url}/api/embedded/transactions`, merchantTrans, {
    headers: {
      Authorization: `Bearer token-between-merchant-account`,
      "Content-Type": "application/json",
    },
  });
};
