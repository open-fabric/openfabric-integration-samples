import axios from "axios";
import { of_api_url } from "../../lib/variables";
import { GetAccessToken } from "../auth";
export const fetchCardInfo = async ({ card_fetch_token }) => {
  const { access_token } = await GetAccessToken();

  const result = await axios.post(
    `${of_issuer_url}/i/fetchCard`,
    {
      card_fetch_token,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
};
