export interface PatLink {
  partner_link_ref: string;
  partner_customer_ref: string;
  of_link_id: string;
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