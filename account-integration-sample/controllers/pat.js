import crypto from 'crypto'

import { db } from '../db'
import { catchAsync } from '../utils/catchAsync';
import {of_issuer_url, of_pat_url} from "../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../services/auth.js";
import {config} from "dotenv";

export const create = catchAsync(async (req, res) => {
  const ref = crypto.randomUUID()
  const customerId = crypto.randomUUID()
  await db.push(`/pat_links/${ref}`, {
    id: ref,
    partner_link_ref: req.body.partner_link_ref,
    partner_customer_id: req.body.partner_customer_id,
    intent: req.body.intent,
    reason: req.body.reason,
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

export const approvePatLink = catchAsync(async (req, res) => {
  let {access_token} = await GetAccessToken()
  console.log('result')
  const result = await axios.patch(
    new URL("/v1/preapproved_transaction_links", of_pat_url).toString(),
    {
      id: req.body.of_link_ref,
      tenant_link_ref: req.body.id,
      reason: "Card is valid for purchasing",
      status: req.body.status,

    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );


  //
  res.send(
    {
      url: `${of_pat_url}/v1/preapproved_transaction_links/redirect?link_id=${result.data.id}`
    }
  );

})
