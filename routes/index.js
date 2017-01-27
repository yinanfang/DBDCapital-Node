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
});

const APIRouter = express.Router();

APIRouter.post('/login', API.Login);

APIRouter.post('/register', API.Register);

APIRouter.get('/user', Auth, API.User);

APIRouter.delete('/deleteUser', API.DeleteUser);

APIRouter.post('/quote', API.Quote);

APIRouter.post('/account/newTransactions', Auth, API.AccountNewTransactionsSubmit);

APIRouter.use('*', API.Error);

/* ***************************************************************************
Export
*****************************************************************************/

export default {
  API: APIRouter,
};
