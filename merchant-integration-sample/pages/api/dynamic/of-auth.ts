import type {NextApiRequest, NextApiResponse} from 'next'
import NextCors from 'nextjs-cors';
import {Authentication} from '../../../controllers/of-auth';

const handler = async (req: NextApiRequest,
                       res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  return Authentication("27hg1p6l68o5u7j002lpdnrc1h", "2psus71pard3r93jp6q82mc1fdb1slqbf05rpmnm7mag0gv257k")(req, res)
}
export default handler
