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

import Router from './routes';

import Config from './config';
import Path from './path';
import WebpackConfig from './webpack.config';

import logger from './utils/logger';

/* ***************************************************************************
Common
*****************************************************************************/

logger.debug(Config);

const app = express();

app.use(morgan('combined', { stream: logger.stream }));

// Redirect from http requests to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  logger.info('insecure connection. Rerouting to https...');
  return res.redirect(`https://${Config.DOMAIN}:${Config.HTTPS_PORT}${req.path}`);
});

// Serve favicon
app.use(favicon(path.join(__dirname, '/src/images/favicon.ico')));
// app.use(favicon({
//   '/favicon.ico': __dirname+'/images/favicon.ico', // Normal desktop
//   '/favicon-144.ico': __dirname+'/images/favicon.ico', // Microsoft
//   '/favicon-192.ico': __dirname+'/images/favicon.ico', // Apple
// }));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***************************************************************************
Parse Server
*****************************************************************************/

app.use(Router.Parse);

/* ***************************************************************************
API v1.0
*****************************************************************************/

app.use('^/api/v1.0', Router.API);

/* ***************************************************************************
Web App
*****************************************************************************/

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
  app.use(Path.DBDCapital.Routes, (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.use(Path.DBDCapital.Routes, (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });
}

/* ***************************************************************************
Error handling after all routing
*****************************************************************************/

if (Config.IS_DEVELOPMENT) {
  app.use(errorHandler());
} else {
  // TODO: Add Production handler
}

/* ***************************************************************************
Server
*****************************************************************************/

http.createServer(app).listen(Config.HTTP_PORT);

// SSL
const SSLOption = {
  ca: [fs.readFileSync('StartCom_root_bundle.crt')], // Avoid importing root crt to Mac Key Chain
  cert: fs.readFileSync('dbd-capital.com.crt'),
  key: fs.readFileSync('dbd-capital.com.key'),
};

// Use undefined to avoid Flow issue: https://github.com/facebook/flow/issues/1684#issuecomment-222624389
https.createServer(SSLOption, app).listen(Config.HTTPS_PORT, undefined, undefined, () => {
  console.info(`${Config.APP_NAME} 🌎 ==> Listening IP: ${Config.IP}, PORT: ${Config.HTTPS_PORT}`);
});
