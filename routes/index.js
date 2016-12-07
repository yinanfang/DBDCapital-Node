// @flow

import express from 'express';

import Path from '../path';

import API from '../api/v1.0';

/* ***************************************************************************
API & Auth
*****************************************************************************/

const AuthRouter = express.Router();

AuthRouter.use(API.ParseJWT);

const APIRouter = express.Router();

APIRouter.use(Path.API.requireAuth, API.RequireAuth);

APIRouter.post('/login', API.Login);

APIRouter.post('/register', API.Register);

APIRouter.get('/user', API.User);

APIRouter.delete('/deleteUser', API.DeleteUser);

/* ***************************************************************************
Export
*****************************************************************************/

export default {
  API: APIRouter,
  Auth: AuthRouter,
};
