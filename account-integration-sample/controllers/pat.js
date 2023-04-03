import crypto from 'crypto'

import { db } from '../db'
import { catchAsync } from '../utils/catchAsync';
import {account_server_url, of_api_url} from "../lib/variables.js";
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
    description: req.body.description,
    constraints: req.body.constraints,
    of_link_ref: req.body.of_link_ref,
    of_gateway_redirect_url: req.body.of_gateway_redirect_url
  })
  console.log('account_server_url')
  console.log(account_server_url)
  res.send({
    tenant_link_ref: ref,
    tenant_customer_id: customerId,
    consent_capture_page_url: new URL(`/pat/consent/${ref}`, account_server_url).toString()
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
  let data = req.body;
  let status = data.status;
  let reason;
  if(status == "approved") {
    reason = "Card is valid for purchasing";
  } else {
    reason = "Card is blocked"
  }
  const result = await axios.patch(
    new URL("/v1/preapproved_transaction_links", of_api_url).toString(),
    {
      id: data.of_link_ref,
      tenant_link_ref: data.id,
      reason: reason,
      status: status,
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
      url: data.of_gateway_redirect_url
    }
  );

})
