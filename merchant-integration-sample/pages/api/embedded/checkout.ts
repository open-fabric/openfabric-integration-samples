import type { NextApiRequest, NextApiResponse } from 'next'
import { EmbeddedCheckout } from '../../../controllers/embedded';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
 return EmbeddedCheckout(req,res)
}
export default handler