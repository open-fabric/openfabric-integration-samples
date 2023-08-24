import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import basicAuthMiddleware from 'nextjs-basic-auth-middleware'
import { Authentication } from './Auth';

const handler = async (req: NextApiRequest,
  res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  if (req.method !== 'POST') {
    return res.status(500).json({
      error: "Method not supported"
    })
  }
  if (!req.body.card_fetch_token) {
    return res.status(500).json({
      error: "Missing card_fetch_token in body"
    })
  }

  if (process.env.BASIC_AUTH_CREDENTIALS) {
    await basicAuthMiddleware(req, res);
  }

  const response = await BackEndFetchCard(req.body.card_fetch_token)
  return res.status(200).json(response)
}

const BackEndFetchCard = async (
  card_fetch_token: string
) => {
  const { access_token } = await Authentication(process.env.MERCHANT_CLIENT_ID ?? '', process.env.MERCHANT_CLIENT_SECRET ?? '')("resources/cards.read");

  const result = await axios.post(
    `${process.env.OF_ISSUER_URL}/v1/tenants/cards/details`,
    {
      card_fetch_token,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
};


export default handler