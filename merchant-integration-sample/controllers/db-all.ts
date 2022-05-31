import type { NextApiRequest, NextApiResponse } from 'next'
import { AllDb } from "../db";
export const AllDbController = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const data = await AllDb();
  res.status(200).json(data);
}