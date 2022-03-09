import { basePath } from "./variables";
import { asyncRequest } from "./asyncRequest";

const config = (token, method, body) => ({
  method,
  json: true,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const createEmbeddedTransaction = async ({ access_token }) => {
  return asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "POST", {
      account_reference_id: `ACC-REF-${Date.now()}`,
      amount: 120.1,
      currency: "SGD",
    })
  );
};
