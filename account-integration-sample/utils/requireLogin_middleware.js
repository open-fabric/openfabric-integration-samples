import {parseCredentials, compareCredentials} from './credentialsExtract.js'
import {basicAuthCredentials} from '../lib/variables.js'
import auth from 'basic-auth'

export const requireLogin = (req, res, next) => {
  if(!basicAuthCredentials) {
    return next()
  }
  if(!req.url.includes('/api/orchestrated/approve') && !req.url.includes('/api/embedded/approve-checkout')) {
    return next()
  }
  if(!req.headers || !req.headers.authorization) {
    response401(req,res)
    return 
  }
  const envCredentials = parseCredentials(basicAuthCredentials)
  const currentCredentials = auth(req)
  if (!currentCredentials || !compareCredentials(currentCredentials, envCredentials)) {
    response401(req,res)
    return
  }
  const session = req.session
  if(!session.timeStamp){
    session.timeStamp = Date.now()
    return next()
  } else {
    if(Math.floor((Date.now() - session.timeStamp)/1000) > 15) {
      response401(req,res)
      return
    }
  }
  return next()
};

const response401 = (req,res) => {
  const session = req.session
  session.timeStamp = Date.now()
  if (req.headers && req.headers.authorization) {
    delete req.headers.authorization;
  }
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  res.sendStatus(401);
}


