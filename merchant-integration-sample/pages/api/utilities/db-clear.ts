import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { ClearDb } from '../../../controllers/db-clear';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
  
 return ClearDb(req,res)
}
export default handler