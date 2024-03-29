import { Buffer } from 'buffer'
import { OF_AUTH_URL, MERCHANT_CLIENT_ID, MERCHANT_CLIENT_SECRET } from '@/lib/config'

export const authenticate = async () => {
  try {
    const params = new URLSearchParams()
    params.set('grant_type', 'client_credentials')
    params.set('scope', '')

    const credentials = Buffer
        .from(`${MERCHANT_CLIENT_ID}:${MERCHANT_CLIENT_SECRET}`)
        .toString('base64')

    let response = await fetch(new URL('/oauth2/token', OF_AUTH_URL).toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    const {access_token: token} = await response.json()
    return token
  } catch (e) {
    throw e
  }
}
