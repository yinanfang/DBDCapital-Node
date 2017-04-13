// @flow

import express from 'express';
import jwtParserMiddleware from 'express-jwt';

import Config from '../config';

import API from '../api/v1.0';

/* ***************************************************************************
API & Auth
*****************************************************************************/

const Auth = jwtParserMiddleware({
  secret: Config.JWT_SECRET,
  userProperty: 'jwt',
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
});

const APIRouter = express.Router();

APIRouter.post('/login', API.Login);

APIRouter.post('/register', API.Register);

APIRouter.get('/user', Auth, API.User);

APIRouter.post('/account', Auth, API.Account);

APIRouter.delete('/deleteUser', API.DeleteUser);

APIRouter.get('/quote', API.Quote);

APIRouter.post('/account/newTransactions', Auth, API.AccountNewTransactionsSubmit);

APIRouter.use('*', API.Error);

/* ***************************************************************************
Export
*****************************************************************************/

export default {
  API: APIRouter,
};
