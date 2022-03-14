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
export const approveTransaction = async ({ account_reference_id }) => {
  const { access_token } = await getAccessToken({
    scopes: `resources/transactions.read resources/transactions.write`,
  });
  return await asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "PUT", {
      account_reference_id,
      status: "Approved",
    })
  );
};
