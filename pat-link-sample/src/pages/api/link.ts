import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { authenticate } from '@/lib/auth'
import { OF_API_URL} from "@/lib/config";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const formRequest = req.body

  const token = await authenticate()

  const domain = req.headers?.origin
  console.log('req.headers')
  console.log(req.headers.origin)
  console.log(req.headers.host)
  console.log(JSON.stringify(req.headers))
  let partnerRedirectUrl = `${domain}/merchant-pat-link/approval_result`;
  var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat','sun'];

  const payload = {
    partner_link_ref: crypto.randomUUID(),
    partner_customer_id: crypto.randomUUID(),
    intent: 'recurring',
    partner_redirect_url: partnerRedirectUrl,
    description:  formRequest.description,
    constraints: {
      amount: formRequest.amount,
      currency: formRequest.currency,
      frequency: formRequest.frequency,
      start_date: new Date(),
      day_of_week: formRequest.frequency == 'weekly' ?  days[new Date().getDay()-1] : undefined,
      day_of_month: formRequest.frequency == 'monthly' ? new Date().getDate() : undefined,
      month_of_year: formRequest.frequency == 'yearly' ? new Date().getMonth() : undefined,
    }
  }
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  }
  try {
    const response = await fetch(`${OF_API_URL}/v1/preapproved_transaction_links`, request)
    if (response.ok) {
      const data = await response.json()
      res.send(data.consent_capture_page_url)
    } else {
      throw new Error(`Error creating link: ${response.statusText}, ${await response.json()}`)
    }
  } catch (e) {
    throw e
  }
}
