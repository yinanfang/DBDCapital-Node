// @flow

import jwt from 'jsonwebtoken';

import Config from '../../config';
import logger from '../../utils/logger';

/* ***************************************************************************
Common
*****************************************************************************/

const getJWTFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const elements = authHeader.split(' ');
    if (elements.length === 2) {
      const scheme = elements[0];
      if (scheme === 'Bearer') {
        return elements[1];
      }
    }
  }
  return '';
};

const ParseJWT = (req, res, next) => {
  const token = getJWTFromRequest(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, Config.JWT_SECRET);
      logger.info(`----------------------------decoded: ${decoded}`);
      req.jwt = decoded;
    } catch (err) {
      logger.error(`ParseJWT ${err.name} - ${err.message}`);
    }
  } else {
    logger.debug('--------------no token ');
  }
  next();
};

const RequireAuth = (req, res, next) => {
  if (req.jwt) {
    next();
  } else {
    logger.info('User enter auth required path without JWT token');
    res.redirect('/login');
    res.end();
  }
};

/* ***************************************************************************
API
*****************************************************************************/

const originalJWTPayload = { foo: 'bar' };
const origianlToken = jwt.sign(originalJWTPayload, Config.JWT_SECRET);

const Login = (req, res, next) => {
  res.setHeader('Authorization', `Bearer ${origianlToken}`);
  res.send('Login!!!');
};

const Register = (req, res, next) => {
  res.send('Reigster!!!');
};

const User = (req, res, next) => {

  res.send('User!!!');
};

export default {
  getJWTFromRequest,
  ParseJWT,
  Register,
  Login,
  User,
  RequireAuth,
};
