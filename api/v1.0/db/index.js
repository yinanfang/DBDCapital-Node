// @flow

import DB from 'mongoose';

import logger from '../../../utils/logger';
import Config from '../../../config';

DB.connect(Config.DATABASE_URI);

// CONNECTION EVENTS
DB.connection.on('connected', () => {
  logger.info(`Mongoose connected to ${Config.DATABASE_URI}`);
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

export default DB;
