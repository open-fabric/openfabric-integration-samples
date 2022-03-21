import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { BackEndFetchCard } from '../../../../controllers/be-fetch-card';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
 });
 return BackEndFetchCard(req,res)
}
export default handler