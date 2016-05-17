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
const IS_SSL = IS_DEVELOPMENT ? false : true;
const PROTOCOL = IS_SSL ? 'https' : 'http';
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 8080;

// Parse server
const APP_NAME = 'DBD Capital';
const SERVER_URL = `${PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/parse`;
const APP_ID = process.env.APP_ID || 'dbdcapital';
const MASTER_KEY = process.env.MASTER_KEY || '70c6093dba5a7e55968a1c7ad3dd3e5a74ef5cac';
// const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH;

// Database - MongoLab
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';

export default {
  IS_DEVELOPMENT,
  IS_SSL,
  APP_NAME,
  APP_ID,
  SERVER_HOST,
  SERVER_PORT,
  MASTER_KEY,
  DATABASE_URI,
  SERVER_URL,
};
