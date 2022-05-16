import type { NextApiRequest, NextApiResponse } from 'next'
import { TransactionByRefId } from '../../../../controllers/orchestrated';

const handler = async (req: NextApiRequest,
  res: NextApiResponse) => {
  return TransactionByRefId(req, res)
}
export default handler