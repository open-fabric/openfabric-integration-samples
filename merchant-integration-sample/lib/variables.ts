
export const env = process.env.NEXT_PUBLIC_ENV || "sandbox";
export const of_auth_url = process.env.NEXT_PUBLIC_OF_AUTH_URL || "";
export const of_api_url = process.env.NEXT_PUBLIC_OF_API_URL || "";
export const payment_methods = process.env.NEXT_PUBLIC_PAYMENT_METHODS || "";
export const payment_gateway_publish_key =
  process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_PUBLISH_KEY || "";
export const payment_gateway_name = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_NAME


// BE only
export const account_api_url =
  process.env.ACCOUNT_SERVER_URL;
export const of_issuer_url = process.env.OF_ISSUER_URL;
export const merchant_client_id = process.env.MERCHANT_CLIENT_ID || "";
export const merchant_client_secret = process.env.MERCHANT_CLIENT_SECRET || "";
