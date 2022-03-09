import { basePath } from "./variables";
import { asyncRequest } from "./asyncRequest";

const config = (token, method, body) => ({
  method,
  json: !!body,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const cancelTransaction = async ({ access_token, account_reference_id, reason }) => {
  return await asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "PUT", {
      account_reference_id,
      status: 'Failed',
      reason
    })
  );
};
