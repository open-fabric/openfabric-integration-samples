import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { ClearDb } from '../../../controllers/db-clear';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
   });
 return ClearDb(req,res)
}
export default handler