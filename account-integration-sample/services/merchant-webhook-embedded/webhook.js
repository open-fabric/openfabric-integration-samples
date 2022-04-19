import axios from "axios";
import { merchant_server_url } from "../../lib/variables";

export const UpdateMerchantWebhook = async (transaction) => {
  const response = await axios.put(
    `${merchant_server_url}/api/embedded/webhook`,
    transaction,
    {
      headers: {
        Authorization: `Bearer token_webhook_between_account_merchant`,
        "Content-Type": "application/json",
      },
    }
  )
  return response.data;
};
