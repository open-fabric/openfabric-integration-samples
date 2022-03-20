export const of_auth_url =
  process.env.OF_AUTH_URL || "https://auth.dev.openfabric.co/oauth2/token";
export const of_api_url =
  process.env.OF_API_URL || "https://api.dev.openfabric.co";
export const account_client_id =
  process.env.ACCOUNT_CLIENT_ID || "s1ecob239rdpoa9bjmcj6tvej";
export const account_client_secrect =
  process.env.ACCOUNT_CLIENT_SECRET ||
  "1ung5oeeurolb87tvgfnvv75tboolaokk1snpu75bhsq1co66te5";
// export const account_client_id =
//   process.env.ACCOUNT_CLIENT_ID || "6cjlneo78ekj36l9hce1lkhb68";
// export const account_client_secrect =
//   process.env.ACCOUNT_CLIENT_SECRET ||
//   "hvsd42o94vg0tq5n5cvqrpdko2j4ll5ma7dgtlr7cdhgvlojlmk";
export const env = process.env.ENV;
export const of_issuer_url =
  process.env.OF_ISSUER_URL || "https://issuer.dev.openfabric.co";
export const account_server_url = process.env.ACCOUNT_SERVER_URL || 'http://localhost:3011'