export const env = process.env.ENV || "sandbox";
export const basePath = process.env.OF_API_URL || 'https://api.sandbox.openfabric.co';
export const of_auth_url = process.env.OF_AUTH_URL || 'https://auth.sandbox.openfabric.co/oauth2/token'
export const account_client_id = process.env.ACCOUNT_CLIENT_ID || '6cjlneo78ekj36l9hce1lkhb68';
export const account_client_secret = process.env.ACCOUNT_CLIENT_SECRET || 'hvsd42o94vg0tq5n5cvqrpdko2j4ll5ma7dgtlr7cdhgvlojlmk'
export const pg_name = process.env.PAYMENT_GATEWAY_NAME || 'xendit'
export const pg_key = process.env.PAYMENT_GATEWAY_PUBLISH_KEY || 'xnd_public_development_AZVI4iAxXD6fCgKzxhy1Rvr5obpIvKcJXNnXldhfjhJbWB7RDhwzakaf2dF3tQM'