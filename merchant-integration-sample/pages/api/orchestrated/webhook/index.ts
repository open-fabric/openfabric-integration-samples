import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { Webhook } from '../../../../controllers/webhook'

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
 });
 return Webhook(req,res)
}
export default handler
