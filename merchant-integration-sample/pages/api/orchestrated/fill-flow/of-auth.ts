import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { FillFlow_Authentication } from '../../../../controllers/of-auth';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
 });
 return FillFlow_Authentication(req,res)
}
export default handler