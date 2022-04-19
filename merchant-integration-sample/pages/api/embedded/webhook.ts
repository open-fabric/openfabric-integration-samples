import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookFromAccount } from '../../../controllers/embedded';

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
     try {
      return WebhookFromAccount(req,res)

     } catch(err) {
       console.log('=== err')
     }
}
export default handler