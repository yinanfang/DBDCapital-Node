// @flow

import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import request from 'request-promise';
import iconv from 'iconv-lite';
import { Request, Response, NextFunction } from 'express';

import Config from '../../config';
import logger from '../../utils/logger';
import GCSecurity, { GCSecurityUtil } from './GCSecurity';

/* ***************************************************************************
Auth
*****************************************************************************/

const Register = (req: Request, res: Response, next: NextFunction) => {
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

const Login = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`API/Login---->${JSON.stringify(req.body)}--${req.body.username}==>${req.body.password}`);
  Parse.User.logIn(req.body.username, req.body.password)
    .then((user) => {
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
    }, (user, error) => {
      logger.error(`Login fail - ${JSON.stringify(user)} - ${JSON.stringify(error)}`);
      res.status(401).json({
        message: 'Login failed...',
        error,
      });
    }
  );
};

const User = (req: Request, res: Response, next: NextFunction) => {
  res.send('User!!!');
};

const DeleteUser = (req: Request, res: Response, next: NextFunction) => {
  res.send('Delete User!!!');
};

/* ***************************************************************************
Account
*****************************************************************************/

const parseStockData = (symbol, data) => {
  return new GCSecurity({
    symbol,
    name: data[0],
    open: data[1],
    previousClose: Number.parseFloat(data[2]),
    lastPrice: Number.parseFloat(data[3]),
    high: Number.parseFloat(data[4]),
    low: Number.parseFloat(data[5]),
    bid: Number.parseFloat(data[6]),
    ask: Number.parseFloat(data[7]),
    volume: Number(data[8]),
    transactionValue: Number.parseFloat(data[9]),
    date: new Date(`${data[30]}T${data[31]}+08:00`), // Beijing(+8) -> UTC
  });
};

const SinaStock = {
  // Return stock array
  lookup: async function lookup(symbolList) {
    const url = `http://hq.sinajs.cn/list=${symbolList.join(',')}`;
    // Wait for promise and use promise result
    return request.get({
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
  if (symbol.match(/^((600|601|603|900)\d{3})|(204(001|002|003|004|007|014|028|091|182))$/)) {
    // 沪市 - A股: 600, 601, 603; B股: 900; 国债回购: 204
    return `sh${symbol}`;
  } else if (symbol.match(/^((000|002|200|300)\d{3})|(1318([01][0123569]))$/)) {
    // 深市 - A股: 000; 中小板: 002; B股: 200; 创业板: 300; 国债回购: 1318
    return `sz${symbol}`;
  }
  return null;
};

async function AccountNewTransactionsSubmit(req: Request, res: Response, next: NextFunction) {
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
    logger.debug('AccountNewTransactionsSubmit.jwt------>', req.jwt);

    await Promise.all(stockList.map(async (stock) => {
      const results = await GCSecurityUtil.find(stock.symbol);
      if (results.length === 0) {
        await GCSecurityUtil.add(stock);
        return;
      } else if (results.length > 1) {
        logger.debug('Found duplicates. Remove old ones.');
        await GCSecurityUtil.deleteAll(results.slice(1));
      }
      const target = results[0];
      await GCSecurityUtil.update(target, stock);
    }));
    logger.debug('finished all!!!');

    // Save to OpenPosition

    res.send(stockList);
  } else {
    res.sendStatus(400);
  }
}

/* ***************************************************************************
Common
*****************************************************************************/

const Quote = (req: Request, res: Response, next: NextFunction) => {

};

const Error = (req: Request, res: Response, next: NextFunction) => {
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
