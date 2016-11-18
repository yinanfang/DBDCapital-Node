// @flow

import express from 'express';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from '../config';
import Path from '../path';

import API from '../api/v1.0';

/* ***************************************************************************
Parse Server
*****************************************************************************/

const ParseRouter = express.Router();

const api = new ParseServer({
  appId: Config.PARSE_APP_ID,
  masterKey: Config.PARSE_MASTER_KEY,
  databaseURI: Config.DATABASE_URI,
  serverURL: Config.PARSE_SERVER_URL, // HTTP or HTTPS. For requests from Cloud Code to Parse Server
  publicServerURL: Config.PARSE_SERVER_URL,
  // cloud: '/Users/compass/Code/DBD/DBDCapital-Node/node_modules/parse-server/lib/cloud-code/Parse.Cloud.js', // Absolute path to your Cloud Code
  // cloud: path.join(__dirname, 'dist/index.html'),
  cloud: Config.PARSE_CLOUD_CODE_ENTRANCE,
});

const dashboard = new ParseDashboard({
  apps: [
    {
      appName: Config.PARSE_APP_NAME,
      appId: Config.PARSE_APP_ID,
      masterKey: Config.PARSE_MASTER_KEY,
      serverURL: Config.PARSE_SERVER_URL,
    },
  ],
  users: Config.PARSE_REMOTE_USERS,
  useEncryptedPasswords: true, // Bcrypt password
}, true // allowInsecureHTTP
);

// make the Parse Server available at /parse
ParseRouter.use(Path.Parse.Server, api);

// make the Parse Dashboard available at /dashboard
ParseRouter.use(Path.Parse.Dashboard, dashboard);

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
  Parse: ParseRouter,
};
