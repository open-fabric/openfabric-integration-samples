import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import basicAuthMiddleware from 'nextjs-basic-auth-middleware'
import axios from "axios";
import qs from "qs";

const handler = async (req: NextApiRequest,
   res: NextApiResponse) => {
   await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
   });

   if (process.env.BASIC_AUTH_CREDENTIALS) {
      await basicAuthMiddleware(req, res);
   }

   return Authentication()(req, res)
}

const Authentication = (id: string = process.env.MERCHANT_CLIENT_ID || "", secret: string = process.env.MERCHANT_CLIENT_SECRET || "") => async (
   req: NextApiRequest,
   res: NextApiResponse
) => {
   const basic = Buffer.from(
      `${id}:${secret}`
   ).toString("base64");
   const body = qs.stringify({
      grant_type: "client_credentials",
      scope: 'resources/transactions.read resources/transactions.create'
   });
   const response = await axios.post(process.env.OF_AUTH_URL || "", body, {
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
         Accept: "application/json",
         Authorization: `Basic ${basic}`,
      },
   })
   res.status(200).json(response.data);
}

export default handler
