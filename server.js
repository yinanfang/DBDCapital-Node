// @flow

import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import https from 'https';
import favicon from 'serve-favicon';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {ParseServer} from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from './config';
import WebpackConfig from './webpack.config.js';

console.log(Config);

const app = express();

if (Config.IS_DEVELOPMENT) {
  const compiler = webpack(WebpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: WebpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', (req, res)=>{
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

// Serve favicon
app.use(favicon(__dirname+'/images/favicon.ico'));
// app.use(favicon({
//   '/favicon.ico': __dirname+'/images/favicon.ico', // Normal desktop
//   '/favicon-144.ico': __dirname+'/images/favicon.ico', // Microsoft
//   '/favicon-192.ico': __dirname+'/images/favicon.ico', // Apple
// }));

// Redirect from http requests to https
app.all('*', function(req, res, next) {
  if (req.secure) {
    return next();
  }
  res.redirect('https://'+Config.HOST+':'+Config.HTTPS_PORT+req.path);
});

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/app/index.html');
});

const api = new ParseServer({
  appId: Config.APP_ID,
  masterKey: Config.MASTER_KEY,
  databaseURI: Config.DATABASE_URI,
  serverURL: Config.SERVER_PARSE_URL, // HTTP or HTTPS. For requests from Cloud Code to Parse Server
  // cloud: '/Users/compass/Code/DBD/DBDCapital-Node/node_modules/parse-server/lib/cloud-code/Parse.Cloud.js', // Absolute path to your Cloud Code
});

const dashboard = new ParseDashboard({
  'apps': [
    {
      'appName': Config.APP_NAME,
      'appId': Config.APP_ID,
      'masterKey': Config.MASTER_KEY,
      'serverURL': Config.SERVER_PARSE_URL,
    },
  ],
});

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Error handling
app.use(function (err, req, res, next) {
  console.log(err.message);
});

http.createServer(app).listen(Config.HTTP_PORT);

const SSLOption = {
  ca: [fs.readFileSync('intermediate.crt'), fs.readFileSync('StartCom_root.crt')],
  cert: fs.readFileSync('dbd-capital.com.crt'),
  key: fs.readFileSync('dbd-capital.com.key'),
};

https.createServer(SSLOption, app).listen(Config.HTTPS_PORT, () => {
  console.info(`${Config.APP_NAME} 🌎 ==> Listening on https://${Config.HOST}:${Config.HTTPS_PORT}`);
});
