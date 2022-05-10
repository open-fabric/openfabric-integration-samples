import type {NextApiRequest, NextApiResponse} from 'next'

export const Webhook = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if(req.method !== 'POST') {
    return res.status(500).json({
      error: "Method not supported"
    })
  }
  console.log('=== req.body')
  res.status(200).json(req.body);
}
