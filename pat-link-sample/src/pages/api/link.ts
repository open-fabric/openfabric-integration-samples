import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { OF_API_ENDPOINT} from '@/lib/config'
import { authenticate } from '@/lib/auth'
import {useDebugValue} from "react";

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
  var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat','sun'];

  const payload = {
    partner_link_ref: crypto.randomUUID(),
    partner_customer_id: crypto.randomUUID(),
    intent: 'recurring',
    partner_redirect_url: 'http://localhost:3000/success',
    reason:  formRequest.reason,
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
  const response = await fetch(
    `${new URL('/v1/preapproved_transaction_links', "http://127.0.0.1:2023")}`, request)
  const data = await response.json()

  console.log('<---', data)

  res.send(data.consent_capture_page_url)
}
