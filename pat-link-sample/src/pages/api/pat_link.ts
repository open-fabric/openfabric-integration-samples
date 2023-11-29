import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as dbService from "../../lib/db";

interface PartnerPreApprovedTransactionLinkRequest {
  link_id: string;
  tenant_link_ref: string;
  gateway_redirect_url: string;
  customer_info: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
  }
  billing_address: {
    address_line_1: string;
    address_line_2: string;
    post_code: string;
    country: string;
  }
}

interface PartnerPreApprovedTransactionLinkResponse {
  partner_onboard_redirect_url: string;
  partner_customer_ref?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req, 'request')
  console.log(res, 'response')
  if (req.method === 'POST') {
    const data = req.body as PartnerPreApprovedTransactionLinkRequest
    const host = req.headers?.['x-forwarded-host'];
    const partnerCustomerRef = crypto.randomUUID();
    const partnerLinkRef = crypto.randomUUID();

    await dbService.addPatLink({
      partner_link_ref: partnerLinkRef,
      partner_customer_ref: partnerCustomerRef,
      of_link_id: data.link_id,
      tenant_link_ref: data.tenant_link_ref,
      gateway_redirect_url: data.gateway_redirect_url,
      customer_info: data.customer_info,
      billing_address: data.billing_address,
    })

    const response:PartnerPreApprovedTransactionLinkResponse = {
      partner_onboard_redirect_url: `${host}/merchant-pat-link/onboarding?partner_link_ref=${partnerLinkRef}`,
      partner_customer_ref: partnerCustomerRef,
    }

    return res.send(response)
  } else if (req.method === 'GET') {
    const partnerLinkRef = req.query.partner_link_ref as string
    const patLink = await dbService.readPatLink(partnerLinkRef)

    return res.send(patLink)
  } else {
    res.status(405).send({ message: 'Only GET and POST requests allowed' })
    return
  }
}
