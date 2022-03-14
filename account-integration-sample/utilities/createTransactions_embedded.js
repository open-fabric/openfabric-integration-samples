import { basePath } from "./variables";
import { asyncRequest } from "./asyncRequest";
import { getAccessToken } from "./getAccessToken";
const config = (token, method, body) => ({
  method,
  json: true,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const createEmbeddedTransaction = async ({
  transaction,
}) => {
  const { access_token } = await getAccessToken({
    scopes: `resources/transactions.read resources/transactions.write`,
  });

  return asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "POST", transaction)
  );
};
