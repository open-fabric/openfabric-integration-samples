import type { NextApiRequest, NextApiResponse } from 'next'
import { OFAuthentication } from "../services/auth";
export const Authentication = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await OFAuthentication("resources/transactions.read resources/transactions.create");
  res.status(200).json(token);
}