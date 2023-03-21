import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { OF_API_ENDPOINT} from '@/lib/config'
import { authenticate } from '@/lib/auth'

type Data = {
  name: string
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = await authenticate()
  const payload = {
    partner_link_ref: crypto.randomUUID(),
    partner_customer_id: crypto.randomUUID(),
    intent: 'recurring',
    partner_redirect_url: 'http://localhost:3000/success',
    description: 'Monthly subscription for goods',
    constraints: {
      amount: 10,
      currency: 'SGD',
      frequency: 'monthly',
      start_date: '2022-03-08T00:00:00.000Z'
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
  const response = await fetch(
    `${new URL('/v1/preapproved_transaction_links', OF_API_ENDPOINT)}`, request)
  const data = await response.json()

  console.log('<---', data)

  res.redirect(data.consent_capture_page_url)
}
