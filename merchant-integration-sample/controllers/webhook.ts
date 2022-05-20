import type {NextApiRequest, NextApiResponse} from 'next'
import { WebhookProcess } from '../services/orchestrated/webhook'

export const Webhook = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log('=== Body Webhook', req.body)
  if(req.method !== 'POST') {
    return res.status(500).json({
      error: "Method not supported"
    })
  }
  WebhookProcess(req.body)
  res.status(200).json(req.body);
}
