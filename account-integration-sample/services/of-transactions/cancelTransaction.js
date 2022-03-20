import axios from "axios";
import { of_api_url } from "../../lib/variables";
import { GetAccessToken } from "../auth";

export const CancelTransaction = async ({ account_reference_id, reason }) => {
  const { access_token } = await GetAccessToken();
  const response = await axios.put(
    `${of_api_url}/t/transactions`,
    {
      account_reference_id,
      status: "Failed",
      reason
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
