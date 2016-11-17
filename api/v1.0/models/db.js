// @flow

import { default as DB } from 'mongoose';

import logger from '../../../utils/logger';
import { DATABASE_URI } from '../../../config';

DB.connect(DATABASE_URI);

// CONNECTION EVENTS
DB.connection.on('connected', () => {
  logger.info(`Mongoose connected to ${DATABASE_URI}`);
});

DB.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});
DB.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
const gracefulShutdown = (msg, callback) => {
  DB.connection.close(() => {
    logger.info(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    process.exit(0);
  });
});

// const DB = mongoose;

export default DB;
