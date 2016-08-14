// @flow

import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Config from './config';
import WebpackConfig from './webpack.config.js';

import logger from './utils/logger.js';

logger.debug(Config);

const app = express();

app.use(morgan('combined', { stream: logger.stream }));

// Redirect from http requests to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  logger.info('insecure connection. Rerouting to https...');
  return res.redirect(`https://${Config.HOST}:${Config.HTTPS_PORT}${req.path}`);
});

// Serve favicon
app.use(favicon(path.join(__dirname, '/images/favicon.ico')));
// app.use(favicon({
//   '/favicon.ico': __dirname+'/images/favicon.ico', // Normal desktop
//   '/favicon-144.ico': __dirname+'/images/favicon.ico', // Microsoft
//   '/favicon-192.ico': __dirname+'/images/favicon.ico', // Apple
// }));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webpack server on dev
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
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });
}

// app.get('/', function(req, res, next) {
//   res.sendFile(__dirname + '/app/index.html');
// });

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
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Error handling after all routing
if (Config.IS_DEVELOPMENT) {
  app.use(errorHandler());
}

http.createServer(app).listen(Config.HTTP_PORT);

const SSLOption = {
  ca: [fs.readFileSync('intermediate.crt'), fs.readFileSync('StartCom_root.crt')],
  cert: fs.readFileSync('dbd-capital.com.crt'),
  key: fs.readFileSync('dbd-capital.com.key'),
};

// Use undefined to avoid Flow issue: https://github.com/facebook/flow/issues/1684#issuecomment-222624389
https.createServer(SSLOption, app).listen(Config.HTTPS_PORT, undefined, undefined, () => {
  console.info(`${Config.APP_NAME} 🌎 ==> Listening on https://${Config.HOST}:${Config.HTTPS_PORT}`);
});
