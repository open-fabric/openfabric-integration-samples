import { v4 as uuid } from "uuid";
import { account_server_url } from "../../lib/variables.js";
export const CreateTransaction = async ({ of_transaction }) => {
  return {
    account_reference_id: uuid(),
    // url for customer redirect to account system
    payment_redirect_web_url: `${account_server_url}/orchestrated/checkout?id=${
      of_transaction.fabric_reference_id || of_transaction.id
    }`,
  };
};

export const CreatePreApprovedTransaction = async ({ of_transaction }) => {
  const amount = of_transaction.amount;
  let status;
  let reason;
  if (amount > 1) {
    status = "approved";
  } else {
    status = "failed";
    reason = "Not credit enough balance";
  }

  return {
    tenant_reference_id: uuid(),
    // url for customer redirect to account system
    status: status,
    reason: reason,
  };
};
