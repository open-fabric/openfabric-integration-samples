import axios from "axios";
import { of_api_url } from "../../lib/variables.js";
import { GetAccessToken } from "../auth.js";

export const ApproveTransaction = async ({
  account_reference_id,
  approved_amount,
  approved_currency
}) => {
  const { access_token } = await GetAccessToken();
  const response = await axios.put(
    `${of_api_url}/t/transactions`,
    {
      account_reference_id,
      ...(approved_amount && { approved_amount: approved_amount }),
      ...(approved_currency && { approved_currency: approved_currency }),
      status: "Approved",
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
