import type { NextApiRequest, NextApiResponse } from 'next'
import { OrchestratedCheckOut } from '../../../controllers/orchestrated';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
 return OrchestratedCheckOut(req,res)
}
export default handler