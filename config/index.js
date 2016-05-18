// @flow
'use strict';

require('dotenv').config();

// Environment
const IS_DEVELOPMENT = process.env.NODE_ENV ? true : false;

// Load environment specific variables
// .env.xxx is located at the root level
if (IS_DEVELOPMENT) {
  require('dotenv').config({path: '.env.development'});
} else {
  require('dotenv').config({path: '.env.production'});
}

// Server
const HOST = process.env.HOST || 'localhost';
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;

// Parse server
const APP_NAME = 'DBD Capital';
const SERVER_URL = `https://${HOST}:${HTTPS_PORT}/parse`;
const APP_ID = process.env.APP_ID || 'dbdcapital';
const MASTER_KEY = process.env.MASTER_KEY || '70c6093dba5a7e55968a1c7ad3dd3e5a74ef5cac';
// const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH;

// Database - MongoLab
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';

module.exports = {
  IS_DEVELOPMENT,
  APP_NAME,
  APP_ID,
  HOST,
  HTTP_PORT,
  HTTPS_PORT,
  SERVER_URL,
  MASTER_KEY,
  DATABASE_URI,
};
