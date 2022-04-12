import dotenv from "dotenv";
dotenv.config();
export const of_auth_url =
  process.env.OF_AUTH_URL || "https://auth.dev.openfabric.co/oauth2/token";
export const of_api_url =
  process.env.OF_API_URL || "https://api.dev.openfabric.co";
export const account_client_id =
  process.env.ACCOUNT_CLIENT_ID || "s1ecob239rdpoa9bjmcj6tvej";
export const account_client_secrect =
  process.env.ACCOUNT_CLIENT_SECRET ||
  "1ung5oeeurolb87tvgfnvv75tboolaokk1snpu75bhsq1co66te5";
export const env = process.env.ENV;
export const of_issuer_url =
  process.env.OF_ISSUER_URL || "https://issuer.dev.openfabric.co";
export const account_server_url = (process.env.ACCOUNT_SERVER_URL || '').replace('http://account-integration-sample:3001',"http://localhost:3001")

// for embedded flow
export const merchant_server_url = process.env.MERCHANT_SERVER_URL || "http://localhost:3000"
export const merchant_redirect_url = merchant_server_url.replace('http://merchant-integration-sample:3000',"http://localhost:3000")