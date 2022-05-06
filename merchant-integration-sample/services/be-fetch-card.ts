import {merchant_client_id, merchant_client_secret,} from "../lib/variables";
import {OFAuthentication} from "./auth";
import {OfFetchCard} from "./of-fetch-card";

export const FetchCard = async (card_fetch_token: any) => {
  const { access_token } = await OFAuthentication(merchant_client_id, merchant_client_secret)("resources/cards.read");
  return await OfFetchCard(card_fetch_token, access_token)
};
