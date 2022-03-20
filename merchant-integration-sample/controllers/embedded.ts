import type { NextApiRequest, NextApiResponse } from 'next'
import { Checkout } from "../services/embedded-checkout";
export const EmbeddedCheckout = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = await Checkout(req.body);
  res.status(200).json(response);
}
