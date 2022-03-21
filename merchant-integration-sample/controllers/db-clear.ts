import type { NextApiRequest, NextApiResponse } from 'next'
import { clearTransactions } from "../db";
export const ClearDb = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await clearTransactions();
  res.status(200);
}
