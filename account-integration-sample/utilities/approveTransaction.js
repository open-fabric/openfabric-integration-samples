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
export const approveTransaction = async ({ access_token, account_reference_id }) => {
  return await asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "PUT", {
      account_reference_id,
      status: 'Approved',
    })
  );
};
