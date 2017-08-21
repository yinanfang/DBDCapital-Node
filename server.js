// @flow

import path from 'path';
import fs from 'fs';

import express from 'express';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import notifier from 'node-notifier';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import Router from './routes';

// Loads all environment variables
import Config from './config';

import Path from './path';
import WebpackConfig from './webpack.config';

import logger from './utils/logger';

/* ****************************************************************************
Common
**************************************************************************** */

logger.debug(Config);

const app = express();

// Log at response
app.use(morgan('combined', { stream: logger.stream }));

// Redirect from http requests to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  logger.warn('insecure connection. Rerouting to https...');
  return res.redirect(`https://${Config.DOMAIN}:${Config.HTTPS_PORT}${req.path}`);
});

// Serve favicon
app.use(favicon(path.join(__dirname, '/src/images/favicon.ico')));
// app.use(favicon({
//   '/favicon.ico': __dirname+'/images/favicon.ico', // Normal desktop
//   '/favicon-144.ico': __dirname+'/images/favicon.ico', // Microsoft
//   '/favicon-192.ico': __dirname+'/images/favicon.ico', // Apple
// }));

// Express Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/* ****************************************************************************
Parse Server
**************************************************************************** */

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
app.use(Path.Parse.Server, api);

// make the Parse Dashboard available at /dashboard
app.use(Path.Parse.Dashboard, dashboard);

/* ****************************************************************************
API v1.0
**************************************************************************** */

app.use(`^${Path.API.basePath}`, Router.API);

/* ****************************************************************************
Web App
**************************************************************************** */

if (Config.IS_DEVELOPMENT) {
  const compiler = webpack(WebpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: WebpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
    // Disable origin protection for dev: https://github.com/webpack/webpack-dev-middleware/pull/191
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(Path.DBDCapital.Routes, (req, res) => {
    // logger.debug('Serving React page');
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.use(Path.DBDCapital.Routes, (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });
}

/* ****************************************************************************
Error handling after all routing
**************************************************************************** */

if (Config.IS_DEVELOPMENT) {
  logger.error('Dev errorHandler!');
  app.use(errorHandler({ log: (err, message, req) => {
    const title = `Error in ${req.method} ${req.url}`;
    logger.error(`${title}\n  ${message}`);
    notifier.notify({
      title,
      message,
      sound: true,
      wait: true,
    });
  } }));
} else {
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      // express-jwt auth failure
      logger.warn(`JWT parse error ${err.name} - ${err.message}`);
      res.status(401).send('invalid token...');
    } else {
      res.status(400).send('Bad request...');
    }
  });
}

/* ****************************************************************************
Server
**************************************************************************** */

http.createServer(app).listen(Config.HTTP_PORT);

// SSL
const SSLOption = {
  ca: [fs.readFileSync('Comodo_root_bundle.crt')], // Avoid importing root crt to Mac Key Chain
  cert: fs.readFileSync('dbd-capital.com.crt'),
  key: fs.readFileSync('dbd-capital.com.key'),
};

// Use undefined to avoid Flow issue: https://github.com/facebook/flow/issues/1684#issuecomment-222624389
https.createServer(SSLOption, app).listen(Config.HTTPS_PORT, undefined, undefined, () => {
  logger.info(`🌎 ==> Listening IP: ${Config.IP}, PORT: ${Config.HTTPS_PORT}`);

  // Convinient urls
  if (Config.IS_DEVELOPMENT) {
    logger.info('Website with BrowserSync: https://localhost:3000');
    logger.info(`Parse Dashboard: ${Config.PARSE_SERVER_BASE}/dashboard/apps`);
  }
});
