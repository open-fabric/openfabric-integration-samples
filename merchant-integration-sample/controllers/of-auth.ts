import type { NextApiRequest, NextApiResponse } from 'next'
import { OFAuthentication } from "../services/auth";
export const OpenFabricAuthentication = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await OFAuthentication();
  res.status(200).json(token);
}
