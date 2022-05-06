import type {NextApiRequest, NextApiResponse} from 'next'
import {OFAuthentication} from "../services/auth";

import {
  merchant_client_secret,
  merchant_client_id,
} from "../lib/variables";

export const Authentication = (id: string = merchant_client_id, secret: string = merchant_client_secret) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await OFAuthentication(id, secret)("resources/transactions.read resources/transactions.create");
  res.status(200).json(token);
}
