import type { NextApiRequest, NextApiResponse } from 'next'
import { FetchCard } from "../services/be-fetch-card";
export const BackEndFetchCard = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if(req.method !== 'POST') {
    return res.status(500).json({
      error: "Method not supported"
    })
  }
  if(!req.body.card_fetch_token) {
    return res.status(500).json({
      error: "Missing card_fetch_token in body"
    })
  }
  const response = await FetchCard(req.body.card_fetch_token);
  res.status(200).json(response);
}
