
import type { NextApiRequest, NextApiResponse } from 'next'

export const ErrorHandler = (err: any, req: NextApiRequest, res: NextApiResponse) => {
  let { message } = err;
  const response = {
    code: 500,
    message,
    stack: err.stack,
  };
  res.status(500).json(response);
};
