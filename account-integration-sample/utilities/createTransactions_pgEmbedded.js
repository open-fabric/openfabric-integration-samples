import { basePath } from "./variables";
import { asyncRequest } from "./asyncRequest";
import { pg_key, pg_name } from "./variables";
import {getAccessToken} from './getAccessToken'
const config = (token, method, body) => ({
  method,
  json: !!body,
  body,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
export const createPGEmbeddedTransaction = async () => {
  const { access_token } = await getAccessToken();
  return await asyncRequest(
    `${basePath}/t/transactions`,
    config(access_token, "POST", {
      account_reference_id: `ACC-REF-${Date.now()}`,
      amount: 120.1,
      currency: "SGD",
      pg_token_provider_config: {
        name: pg_name,
        publishable_key: pg_key,
      },
    })
  );
};
