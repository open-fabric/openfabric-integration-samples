import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { getDB } from './transactions/db';
import { PPaaSTransaction } from './transactions/types';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  console.log('=== Body Webhook', req.body)
  if (req.method === 'POST') {
    if (req.body.ppaasTransactionId) {
      try {
        const ppaasTransaction: PPaaSTransaction = await getDB().getData(`/${req.body.ppaasTransactionId}`);
        await getDB().push(`/${req.body.ppaasTransactionId}`, {
          ...ppaasTransaction,
          ...req.body
        });
      } catch (error) {
        console.warn('No transaction found ppasTransactionId=', req.body.ppaasTransactionId);
      }
    }

    res.status(200).json({status: 'success'})
    return;
  }

  res.status(405).json({
    message: `Method ${req.method} not allowed`,
  });
}
export default handler
