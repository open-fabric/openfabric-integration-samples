

import type { NextApiRequest, NextApiResponse } from 'next'
import { Checkout } from '../services/orchestrated/checkout';
import { getTransactionByRefId } from '../services/orchestrated/getTransaction';

export const OrchestratedCheckOut = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = await Checkout(req.body);
  res.status(200).json(response);
}

export const TransactionByRefId = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = getTransactionByRefId(req.query['id'] as string);
  res.status(200).json(response);
}