import { of_issuer_url } from "./variables";
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
export const fetchCardInfo = async ({
  card_fetch_token
}) => {
  const { access_token } = await getAccessToken({
    scopes: `resources/cards.read`
  });
  console.log("===  card fetch Info", {
    url: `${of_issuer_url}/i/fetchCard`,
    access_token,
    card_fetch_token: card_fetch_token,
  });
  return await asyncRequest(
    `${of_issuer_url}/i/fetchCard`,
    config(access_token, "POST", {
      card_fetch_token,
    })
  );
};
