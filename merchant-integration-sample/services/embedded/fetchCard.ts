import axios from "axios";
import { account_api_url } from "../../lib/variables";
import { readTransaction } from "../../db";
import { OfFetchCard } from "../of-fetch-card";
export const fetchCardByMerchantRefId = async (
  merchant_reference_id: string
) => {
  const transaction = readTransaction(merchant_reference_id);
  if (
    transaction.account_reference_id &&
    transaction.status === "Approved" &&
    transaction.ofTransaction &&
    transaction.ofTransaction.card_fetch_token
  ) {
    // calling auth
    const accessTokenResult = await authFromAccountServer(transaction);
    const result = await OfFetchCard(
      transaction.ofTransaction.card_fetch_token,
      accessTokenResult.access_token
    );
    return result;
  }
  throw Error("merchant_reference_id is not correct");
};

const authFromAccountServer = async (merchantTrans: any) => {
  return axios
    .post(
      `${account_api_url}/api/embedded/transaction/card-auth`,
      { account_reference_id: merchantTrans.account_reference_id },
      {
        headers: {
          Authorization: `Bearer token-between-merchant-account`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.data)
};
