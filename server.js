// @flow

// import path from 'path';
import express from 'express';
import {ParseServer} from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from './config';

console.log(Config);

const app = express();

const api = new ParseServer({
  appId: Config.APP_ID,
  masterKey: Config.MASTER_KEY,
  databaseURI: Config.DATABASE_URI,
  serverURL: Config.SERVER_URL, // HTTP or HTTPS. For requests from Cloud Code to Parse Server
  cloud: '/Users/compass/Code/DBDCapital-Node/node_modules/parse-server/lib/cloud-code/Parse.Cloud.js', // Absolute path to your Cloud Code
});

const dashboard = new ParseDashboard({
  'apps': [
    {
      'appName': Config.APP_NAME,
      'appId': Config.APP_ID,
      'masterKey': Config.MASTER_KEY,
      'serverURL': Config.SERVER_URL,
    },
  ],
});

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

app.listen(Config.SERVER_PORT, function() {
  console.log('parse-server-example running on port ' + Config.SERVER_PORT);
});
