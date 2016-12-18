// @flow

import dotenv from 'dotenv';
import ip from 'ip';

import Path from '../path';

// Environment
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Load environment specific variables
// .env.xxx locat at the root level
if (IS_DEVELOPMENT) {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env.production' });
}

// Server
const IP = ip.address();
const DOMAIN = 'dbd-capital.com';
const HTTP_PORT = IS_DEVELOPMENT ? 8080 : 80;
const HTTPS_PORT = IS_DEVELOPMENT ? 8443 : 443;
// const SERVER_URL = `https://${IP}:${HTTPS_PORT}`;
const SERVER_URL = IS_DEVELOPMENT ? `https://localhost:${HTTPS_PORT}` : `https://${DOMAIN}:${HTTPS_PORT}`;
const SERVER_API_BASE = `${SERVER_URL}${Path.API.basePath}`;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'B49K2USXPCxZgmLdVsJtDpCBCsiVnURy';

// Database - MongoLab
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/local';

// Loggly
const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN || 'ijdiwjci-d27d-jdjh-vdj2-ijdhu28djdss';

// Parse server
const PARSE_APP_NAME = 'DBD Capital';
const PARSE_SERVER_BASE = IS_DEVELOPMENT ? `https://${IP}:${HTTPS_PORT}` : `https://${DOMAIN}:${HTTPS_PORT}`; // Use IP to allow external access
const PARSE_SERVER_URL = `${PARSE_SERVER_BASE}/parse`; // Use IP to allow external access
const PARSE_APP_ID = process.env.PARSE_APP_ID || 'a7e55968a1c7ad3dd3e5a';
const PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY || '70c6093dba5a7e55968a1c7ad3dd3e5a74ef5cac';
const PARSE_CLOUD_CODE_ENTRANCE = `${__dirname}/../cloud/main.js`;
const PARSE_CLOUD_API_BASE = `${PARSE_SERVER_URL}/functions`;
const PARSE_REMOTE_USERS = JSON.parse('[{"user":"lucas","pass":"test"}]');
// const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH;

export default {
  IS_DEVELOPMENT,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  IP,
  DOMAIN,
  HTTP_PORT,
  HTTPS_PORT,
  SERVER_URL,
  SERVER_API_BASE,
  PARSE_SERVER_BASE,
  PARSE_SERVER_URL,
  PARSE_MASTER_KEY,
  PARSE_CLOUD_CODE_ENTRANCE,
  PARSE_CLOUD_API_BASE,
  PARSE_REMOTE_USERS,
  DATABASE_URI,
  LOGGLY_TOKEN,
  JWT_SECRET,
};
