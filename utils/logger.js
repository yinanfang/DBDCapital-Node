// Reference: http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
// @flow

import path from 'path';
import winston from 'winston';

import Config from '../config';

require('winston-loggly');


// Log levels: https://github.com/winstonjs/winston/blob/master/lib/winston/config/cli-config.js

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, '../logs/winston-logs.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      prettyPrint: true,
      colorize: true,
    }),
    new winston.transports.Loggly({
      level: 'info',
      inputToken: Config.LOGGLY_TOKEN,
      subdomain: 'yinanfang',
      tags: ['DBDCapital'],
      json: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.stream = {
  write: (message, encoding) => {
    logger.debug(message);
  },
};
