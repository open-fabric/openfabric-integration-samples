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

export const initiatePatCreation = catchAsync(async (req, res) => {
  const data = req.body;

  try {
    const {access_token} = await GetAccessToken()

    const result = await axios.post(
      new URL(`/v1/preapproved_transaction_links`, of_api_url).toString(),
      {
        tenant_link_ref: crypto.randomUUID(),
        tenant_customer_ref: crypto.randomUUID(),
        tenant_partner_ref: data.tenant_partner_ref,
        return_url: data.return_url,
        description: data.description,
        constraints: {
          currency: data.currency,
          start_date: new Date().toISOString(),
        },
        customer_info: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email ? data.email: undefined,
          mobile_number: data.mobile_number
        },
        billing_address: {
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2,
          city: data.city,
          country: data.country,
          post_code: data.post_code
        }
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.send({
      url: result.data.gateway_redirect_url
    })
  } catch (e) {
    res.status(404).send(`Unable to create PAT Link: ${e}`)
  }
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

export const createPatPage = catchAsync(async (req, res) => {
  res.render("pat/create", {});
})

export const createPatSuccessPage = catchAsync(async (req, res) => {
  const query = req.query
  res.render("pat/create_success", {
    data: {
      link_id: query.link_id,
      partner_link_ref: query.partner_link_ref,
      tenant_link_ref: query.tenant_link_ref,
      status: query.status,
    }
  })
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
