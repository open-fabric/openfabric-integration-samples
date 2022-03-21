import axios from "axios";
import { of_issuer_url } from "../lib/variables";
import { OFAuthentication } from "./auth";
export const FetchCard = async (card_fetch_token: any) => {
  const { access_token } = await OFAuthentication("resources/cards.read");
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
