// @flow

import express from 'express';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from '../config';
import Path from '../path';

/* ***************************************************************************
Parse Server
*****************************************************************************/

const ParseRouter = express.Router();

const api = new ParseServer({
  appId: Config.APP_ID,
  masterKey: Config.MASTER_KEY,
  databaseURI: Config.DATABASE_URI,
  serverURL: Config.SERVER_PARSE_URL, // HTTP or HTTPS. For requests from Cloud Code to Parse Server
  // cloud: '/Users/compass/Code/DBD/DBDCapital-Node/node_modules/parse-server/lib/cloud-code/Parse.Cloud.js', // Absolute path to your Cloud Code
});

const dashboard = new ParseDashboard({
  apps: [
    {
      appName: Config.APP_NAME,
      appId: Config.APP_ID,
      masterKey: Config.MASTER_KEY,
      serverURL: Config.SERVER_PARSE_URL,
    },
  ],
});

// make the Parse Server available at /parse
ParseRouter.use(Path.Parse.Server, api);

// make the Parse Dashboard available at /dashboard
ParseRouter.use(Path.Parse.Dashboard, dashboard);

/* ***************************************************************************
API
*****************************************************************************/

const APIRouter = express.Router();

APIRouter.get('/login', (req, res) => {
  res.send('got it');
});

APIRouter.get('/register', (req, res) => {
  res.send('got it');
});

APIRouter.get('/user', (req, res) => {
  res.send('got it');
});

/* ***************************************************************************
Export
*****************************************************************************/

export default {
  Parse: ParseRouter,
  API: APIRouter,
};
