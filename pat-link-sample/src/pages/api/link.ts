import { Buffer } from 'buffer'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  OF_AUTH_ENDPOINT, OF_API_ENDPOINT,
  MERCHANT_CLIENT_ID, MERCHANT_CLIENT_SECRET
} from '@/lib/config'

type Data = {
  name: string
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const params = new URLSearchParams()
  params.set('grant_type', 'client_credentials')
  params.set('scope', '')

  const credentials = Buffer
    .from(`${MERCHANT_CLIENT_ID}:${MERCHANT_CLIENT_SECRET}`)
    .toString('base64')

  let response = await fetch(`${new URL('/oauth2/token', OF_AUTH_ENDPOINT)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  })
  const { access_token: token } = await response.json()
  console.log('<---', [token])
  const url = new URL('/public/pat/v1/preapproved_transaction_links', OF_API_ENDPOINT)
  const request = {
    partner_link_ref: '',
    partner_customer_id: '',
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
  response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'of-authorization': `Bearer ${token}`
    },
    body: JSON.stringify(request)
  })
  const data = await response.json()

  console.log('<---', data)

  res.redirect(data.partner_redirect_url)
}
