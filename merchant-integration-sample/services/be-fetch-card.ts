import axios from "axios";
import { of_issuer_url } from "../lib/variables";
import { OFAuthentication } from "./auth";
import { OfFetchCard } from "./of-fetch-card";
export const FetchCard = async (card_fetch_token: any) => {
  const { access_token } = await OFAuthentication("resources/cards.read");
  const result = await OfFetchCard(card_fetch_token, access_token)
  return result
};
