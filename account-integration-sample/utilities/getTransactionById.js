import {basePath} from './variables'
import {asyncRequest} from './asyncRequest'

const config = (token, method, body) => ({
  method,
  json: !!body,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const getTransactionById = async ({access_token, transaction_id}) => {
 return await asyncRequest(
    `${basePath}/t/transactions/${transaction_id}`,
    config(access_token, "GET")
  );
}