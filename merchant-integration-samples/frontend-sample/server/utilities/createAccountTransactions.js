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
export const createAccountTransaction = async (trans) => {
  return asyncRequest(
    `http://host.docker.internal:3001/merchant/create-transaction`,
    config("tokenbetweenmerchantandaccount", "POST", trans)
  );
};