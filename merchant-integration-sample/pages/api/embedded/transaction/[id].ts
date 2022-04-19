import type { NextApiRequest, NextApiResponse } from 'next'
import { TransactionByRefId } from '../../../../controllers/embedded';

const handler = async (req: NextApiRequest,
  res: NextApiResponse) => {
  return TransactionByRefId(req, res)
}
export default handler