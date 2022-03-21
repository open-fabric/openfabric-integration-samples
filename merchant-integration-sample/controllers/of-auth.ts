import type { NextApiRequest, NextApiResponse } from 'next'
import { OFAuthentication } from "../services/auth";
export const FillFlow_Authentication = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await OFAuthentication('resources/transctions.read resources/transctions.write resources/cards.read');
  res.status(200).json(token);
}

export const Authentication = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await OFAuthentication("resources/cards.read");
  res.status(200).json(token);
}