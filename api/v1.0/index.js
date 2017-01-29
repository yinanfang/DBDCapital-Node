// @flow

import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import request from 'request-promise';
import iconv from 'iconv-lite';

import Config from '../../config';
import logger from '../../utils/logger';

/* ***************************************************************************
Auth
*****************************************************************************/

const Register = (req, res, next) => {
  logger.debug(`in register...${JSON.stringify(req.body)}`);

  const newUser = new Parse.User();
  Object.keys(req.body).forEach((key) => {
    newUser.set(key, req.body[key]);
  });

  newUser.signUp(null, {
    success: (user) => {
      logger.debug(`sign up successfully...${JSON.stringify(user)}`);
      res.send('Reigster!!!');
    },
    error: (user, error) => {
      logger.debug(`sign up failed...${user} - ${error.code} - ${error.message} - ${Config.PARSE_SERVER_URL} - ${Config.PARSE_APP_ID}`);
      res.send('Fail...');
    },
  });
};

const Login = (req, res, next) => {
  logger.debug(`API/Login---->${JSON.stringify(req.body)}--${req.body.username}==>${req.body.password}`);
  Parse.User.logIn(req.body.username, req.body.password, {
    success: (user) => {
      logger.info(`Login success - ${user.constructor.name} - ${JSON.stringify(user)}`);
      const originalJWTPayload = {
        username: user.getUsername(),
        parseSessionToken: user.getSessionToken(),
        email: user.getEmail(),
      };
      logger.info(`----------jwt payload: ${JSON.stringify(originalJWTPayload)}`);
      const token = jwt.sign(originalJWTPayload, Config.JWT_SECRET);
      res.cookie('token', token, { maxAge: 3 * 60 * 60 * 1000, httpOnly: true, secure: true });
      res.status(200);
      res.json({
        message: 'Login successfully!!!',
        token,
      });
    },
    error: (user, error) => {
      logger.error(`Login fail - ${JSON.stringify(user)} - ${JSON.stringify(error)}`);
      res.status(401).json({
        message: 'Login failed...',
        error,
      });
    },
  });
};

const User = (req, res, next) => {
  res.send('User!!!');
};

const DeleteUser = (req, res, next) => {
  res.send('Delete User!!!');
};

/* ***************************************************************************
Account
*****************************************************************************/
const parseStockData = (symbol, data) => {
  return {
    symbol,
    name: data[0],
    open: data[1],
    close: data[2],
    current: data[3],
    high: data[4],
    low: data[5],
    bid: data[6],
    ask: data[7],
    volume: data[8],
    transactionValue: data[9],
    date: new Date(`${data[30]}T${data[31]}+08:00`), // Beijing(+8) -> UTC
  };
};

const SinaStock = {
  // Return stock array
  lookup: async function lookup(symbolList) {
    const url = `http://hq.sinajs.cn/list=${symbolList.join(',')}`;
    // Wait for promise and use promise result
    return await request.get({
      url,
      encoding: null,
    })
    .then((response) => {
      const converted = iconv.decode(response, 'GBK').split('\n');
      converted.pop(); // pop the new line at the end
      const stockList = converted.map((detailText) => {
        const parts = detailText.split('=');
        const symbol = parts[0].split('_').pop();
        const data = parts[1].split('"')[1].split(',');
        logger.debug('parseStockData(symbol, data)', parseStockData(symbol, data));
        return parseStockData(symbol, data);
      });
      return stockList;
    })
    .catch((error) => {
      logger.error('SinaStock error: ', error.message);
    });
  },
};

// Prefix market string for API call
const getFixedSymbol = (symbol) => {
  if (symbol.match(/^(600|601|603|900)\d{3}$/)) {
    return `sh${symbol}`;
  } else if (symbol.match(/^(000|002|200|300)\d{3}$/)) {
    return `sz${symbol}`;
  }
  return null;
};

async function AccountNewTransactionsSubmit(req, res, next) {
  const allTrans = req.body.newTransactions;
  logger.debug(allTrans);
  const symbolList = Object.keys(allTrans)
    .reduce((prev, key) => {
      const fixedSymbol = getFixedSymbol(allTrans[key].symbol);
      if (fixedSymbol) {
        return [fixedSymbol, ...prev];
      }
      return prev;
    }, []);

  if (symbolList.length > 0) {
    const stockList = await SinaStock.lookup(symbolList);
    logger.debug('AccountNewTransactionsSubmit.stockList------>', stockList);
    res.send(stockList);
  } else {
    res.sendStatus(404);
  }
}

/* ***************************************************************************
Common
*****************************************************************************/

const Quote = (req, res, next) => {

};

const Error = (req, res, next) => {
  res.sendStatus(404);
};

export default {
  Register,
  Login,
  User,
  DeleteUser,
  AccountNewTransactionsSubmit,
  Quote,
  Error,
};
