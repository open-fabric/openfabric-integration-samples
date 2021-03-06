import { v4 as uuid } from "uuid";
import {
  account_server_url
} from "../../lib/variables";
export const CreateTransaction = async ({
  of_transaction
}) => {
  return {
    account_reference_id: uuid(),
    // url for customer redirect to account system
    payment_redirect_web_url: `${account_server_url}/orchestrated/checkout?id=${of_transaction.fabric_reference_id ||
      of_transaction.id}`,
  }
};
