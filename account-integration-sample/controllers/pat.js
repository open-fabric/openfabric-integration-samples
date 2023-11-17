import crypto from 'crypto'

import { db } from '../db/index.js'
import { catchAsync } from '../utils/catchAsync.js';
import {account_server_url, of_api_url} from "../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../services/auth.js";

export const create = catchAsync(async (req, res) => {
  const ref = crypto.randomUUID()
  const customerId = crypto.randomUUID()
  await db.push(`/pat_links/${ref}`, {
    id: ref,
    partner_link_ref: req.body.partner_link_ref,
    partner_customer_ref: req.body.partner_customer_ref,
    intent: req.body.intent,
    description: req.body.description,
    constraints: req.body.constraints,
    of_link_id: req.body.link_id,
    of_gateway_redirect_url: req.body.gateway_redirect_url
  })
  res.send({
    tenant_link_ref: ref,
    tenant_customer_ref: customerId,
    tenant_consent_redirect_url: new URL(`/pat/consent/${ref}`, account_server_url).toString()
  })
})

export const consentCapturePage = catchAsync(async (req, res) => {
  try {
    const {access_token} = await GetAccessToken()
    const patLinkData = db.getData(`/pat_links/${req.params.id}`)

    const result = await axios.get(
      new URL(`/v1/preapproved_transaction_links/${patLinkData.of_link_id}`, of_api_url).toString(),
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.render('pat/consent', {
      patLink: result.data
    })
  } catch (e) {
    console.error('Failed to fetch PAT link data', e);
    res.status(404).send('Not found')
  }
})

export const approvePatLink = catchAsync(async (req, res) => {
  const {access_token} = await GetAccessToken()
  const patLinkData = db.getData(`/pat_links/${req.params.id}`)
  const status = req.body.status;
  let reason;
  if(status == "approved") {
    reason = "Card is valid for purchasing";
  } else {
    reason = "Card is blocked"
  }
  await axios.patch(
    new URL("/v1/preapproved_transaction_links", of_api_url).toString(),
    {
      tenant_link_ref: patLinkData.id,
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

  res.send(
    {
      url: patLinkData.of_gateway_redirect_url,
    }
  );

})
