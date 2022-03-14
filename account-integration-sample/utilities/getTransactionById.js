import { basePath } from "./variables";
import { asyncRequest } from "./asyncRequest";
import { getAccessToken } from "./getAccessToken";

const config = (token, method, body) => ({
  method,
  json: !!body,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const getTransactionById = async ({ transaction_id }) => {
  const { access_token } = await getAccessToken({
    scopes: `resources/transactions.read resources/transactions.write`,
  });
  return await asyncRequest(
    `${basePath}/t/transactions/${transaction_id}`,
    config(access_token, "GET")
  );
};
