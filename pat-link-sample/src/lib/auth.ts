import jwt from 'jsonwebtoken'
import {
  OF_AUTH_ENDPOINT, MERCHANT_CLIENT_ID, MERCHANT_CLIENT_SECRET,
  INTERNAL_JWT_SECRET
} from '@/lib/config'

export const localAuthToken = (payload: Record<string, string>, secret: string = INTERNAL_JWT_SECRET) => {
  return jwt.sign({

  }, secret)
}

export const publicAuthToken = async () => {
  const params = new URLSearchParams()
  params.set('grant_type', 'client_credentials')
  params.set('scope', '')

  const credentials = Buffer
    .from(`${MERCHANT_CLIENT_ID}:${MERCHANT_CLIENT_SECRET}`)
    .toString('base64')

  let response = await fetch(`${new URL('/oauth2/token', OF_AUTH_ENDPOINT)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  })
  const { access_token: token } = await response.json()
  return token
}
