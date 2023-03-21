import crypto from 'crypto'

import { db } from '../db'
import { catchAsync } from '../utils/catchAsync';


export const create = catchAsync(async (req, res) => {
  const ref = crypto.randomUUID()
  const customerId = crypto.randomUUID()
  await db.push(`/pat_links/${ref}`, {
    id: ref,
    partner_link_ref: req.body.partner_link_ref,
    partner_customer_id: req.body.partner_customer_id,
    intent: req.body.intent,
    description: req.body.description,
    constraints: req.body.constraints,
    of_link_ref: req.body.of_link_ref
  })
  res.send({
    tenant_link_ref: ref,
    tenant_customer_id: customerId,
    consent_capture_page_url: `http://localhost:4000/pat/consent/${ref}`
  })
})

export const consentCapturePage = catchAsync(async (req, res) => {
  try {
    const patLink = await db.getData(`/pat_links/${req.params.id}`)
    console.log(req.params, patLink)
    res.render('pat/consent', {
      patLink
    })
  } catch (e) {
    res.status(404).send('Not found')
  }
})
