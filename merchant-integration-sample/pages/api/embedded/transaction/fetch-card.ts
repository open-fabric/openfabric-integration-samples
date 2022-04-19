import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCard } from '../../../../controllers/embedded';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
 return fetchCard(req,res)
}
export default handler