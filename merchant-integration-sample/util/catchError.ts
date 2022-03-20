import type { NextApiRequest, NextApiResponse } from 'next'
import {ErrorHandler} from './errorHandler'
export const CatchError = (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => (req: NextApiRequest, res: NextApiResponse) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    ErrorHandler(err,req,res)
  });
};


