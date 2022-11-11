import { v4 as uuidv4 } from "uuid"

export const getTransactionOrder = (): any => {
  const partnerRefId = uuidv4();

  return {
    partner_reference_id: partnerRefId,
    partner_redirect_success_url: `https://merchant-1.samples.dev.openfabric.co/orchestrated/pg-sample/payment-success?merchant_ref=${partnerRefId}`,
    partner_redirect_fail_url: `https://merchant-1.samples.dev.openfabric.co/orchestrated/pg-sample/payment-failed?merchant_ref=${partnerRefId}`,
    pg_name: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_NAME || "xendit",
    pg_publishable_key: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY || "xnd_public_development_AZVI4iAxXD6fCgKzxhy1Rvr5obpIvKcJXNnXldhfjhJbWB7RDhwzakaf2dF3tQM",
    pg_flow: "tokenization",
    customer_info: {
      mobile_number: "+6587654321",
      first_name: "BNPL",
      last_name: "Developer",
      email: "developer@bnpl1.com"
    },
    amount: 50000,
    currency: "PHP",
    transaction_details: {
      shipping_address: {
        country: "Singapore",
        country_code: "SG",
        address_line_1: "80 Robinson Road",
        address_line_2: "#09-01",
        address_line_3: "#09-01",
        post_code: "068898"
      },
      billing_address: {
        country: "Singapore",
        country_code: "SG",
        address_line_1: "80 Robinson Road",
        address_line_2: "#09-01",
        address_line_3: "#09-01",
        post_code: "068898"
      },
      items: [
        {
          item_id: "P100",
          name: "iPhone",
          price: 11020,
          quantity: 1,
          variation_name: "Black, 128GB",
          original_price: 12020,
          categories: [
            "Electronics"
          ]
        },
        {
          item_id: "P101",
          name: "iPhone SE case",
          price: 1000,
          quantity: 1,
          variation_name: "White",
          categories: [
            "Accessories"
          ]
        }
      ],
      tax_amount_percent: 3,
      shipping_amount: 1020,
      original_amount: 13020
    }
  }
}
