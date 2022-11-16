import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  console.log('=== Body Webhook', req.body)
  if (req.method !== 'POST') {
    return res.status(500).json({
      error: "Method not supported"
    })
  }

  res.status(200).json(req.body);
}
export default handler
