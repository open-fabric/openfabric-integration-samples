import axios from "axios";
import { of_issuer_url } from "../lib/variables";
export const OfFetchCard = async (card_fetch_token: string, access_token: string) => {
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
