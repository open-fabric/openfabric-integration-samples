import type {NextApiRequest, NextApiResponse} from 'next'
import basicAuthMiddleware from 'nextjs-basic-auth-middleware'
import {OFAuthentication} from "../services/auth";

import {
  merchant_client_secret,
  merchant_client_id,
  basicAuthCredentials
} from "../lib/variables";

export const Authentication = (id: string = merchant_client_id, secret: string = merchant_client_secret) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (basicAuthCredentials) {
    await basicAuthMiddleware(req, res);
  }
  const token = await OFAuthentication(id, secret)("resources/transactions.read resources/transactions.create");
  res.status(200).json(token);
}
