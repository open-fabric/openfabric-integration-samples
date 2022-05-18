import type { NextApiRequest, NextApiResponse } from 'next'
import basicAuthMiddleware from 'nextjs-basic-auth-middleware'
import { Checkout } from "../services/embedded/checkout";
import { WebhookFromAccountServer } from "../services/embedded/account-webhook";
import { getTransactionByRefId } from '../services/embedded/getTransaction'
import { fetchCardByMerchantRefId } from '../services/embedded/fetchCard';

export const EmbeddedCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (process.env.BASIC_AUTH_CREDENTIALS) {
    await basicAuthMiddleware(req, res);
  }
  const response = await Checkout(req.body);
  res.status(200).json(response);
}

export const WebhookFromAccount = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  WebhookFromAccountServer(req.body);
  res.status(200).json({
    message: 'ok'
  });
}

export const TransactionByRefId = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = getTransactionByRefId(req.query['id'] as string);
  res.status(200).json(response);
}

export const fetchCard = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (process.env.BASIC_AUTH_CREDENTIALS) {
    await basicAuthMiddleware(req, res);
  }
  const response = await fetchCardByMerchantRefId(req.body.merchant_reference_id);
  res.status(200).json(response);
}
