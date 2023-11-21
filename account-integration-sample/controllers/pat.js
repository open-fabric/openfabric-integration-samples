import crypto from 'crypto'

import { catchAsync } from '../utils/catchAsync.js';
import {of_api_url} from "../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../services/auth.js";

// update to hit create pat endpoint
export const create = catchAsync(async (req, res) => {
  const data = req.body;

  try {
    const {access_token} = await GetAccessToken()

    const result = await axios.post(
      new URL(`/v1/preapproved_transaction_links`, of_api_url).toString(),
      {
        tenant_link_ref: data.tenant_link_ref,
        tenant_partner_ref: data.tenant_partner_ref,
        tenant_customer_ref: data.tenant_customer_ref,
        return_url: data.returl_url,
        description: data.description,
        constraints: {
          currency: data.currency,
          start_date: new Date().toISOString(),
        },
        customer_info: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
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
      url: result.gateway_redirect_url
    })
  } catch (e) {
    res.status(404).send('Unable to create')
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
  res.render("pat/create", {
    tenant_link_ref: crypto.randomUUID(),
    tenant_partner_ref: crypto.randomUUID(),
    tenant_customer_ref: crypto.randomUUID(),
  });
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
