import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { Authentication } from './Auth';

const handler = async (req: NextApiRequest,
  res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const token = await Authentication(process.env.MERCHANT_CLIENT_ID ?? '', process.env.MERCHANT_CLIENT_SECRET ?? '')("resources/transactions.read resources/transactions.create");

  res.status(200).json(token);
}

export default handler
