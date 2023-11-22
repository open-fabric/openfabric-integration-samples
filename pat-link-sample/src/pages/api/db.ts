import type { NextApiRequest, NextApiResponse } from 'next'

import { cleatPatLinks } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await cleatPatLinks();
  } else {
    res.status(405).send({ message: 'Only GET and POST requests allowed' })
    return
  }
}
