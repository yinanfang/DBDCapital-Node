// @flow

// import path from 'path';
import fs from 'fs';
import express from 'express';
import http from 'http';
import https from 'https';
import {ParseServer} from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from './config';

console.log(Config);

const app = express();

// Redirect from http requests to https
app.all('*', function(req, res, next) {
  if (req.secure) {
    return next();
  }
  res.redirect('https://'+Config.HOST+':'+Config.HTTPS_PORT+req.path);
});

const api = new ParseServer({
  appId: Config.APP_ID,
  masterKey: Config.MASTER_KEY,
  databaseURI: Config.DATABASE_URI,
  serverURL: Config.SERVER_URL, // HTTP or HTTPS. For requests from Cloud Code to Parse Server
  // cloud: '/Users/compass/Code/DBD/DBDCapital-Node/node_modules/parse-server/lib/cloud-code/Parse.Cloud.js', // Absolute path to your Cloud Code
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

http.createServer(app).listen(Config.HTTP_PORT);

const SSLOption = {
  ca: [fs.readFileSync('intermediate.crt'), fs.readFileSync('StartCom_root.crt')],
  cert: fs.readFileSync('dbd-capital.com.crt'),
  key: fs.readFileSync('dbd-capital.com.key'),
};

https.createServer(SSLOption, app).listen(Config.HTTPS_PORT, () => {
  console.log(Config.APP_NAME+' running on port ' + Config.HTTPS_PORT);
});
