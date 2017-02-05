// @flow

import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import request from 'request-promise';
import iconv from 'iconv-lite';
import { Request, Response, NextFunction } from 'express';

import Config from '../../config';
import logger from '../../utils/logger';
import { GCSecurityUtil } from './GCAPIUtil';
import GCSecurity from '../../model/GCSecurity';
import GCTransaction from '../../model/GCTransaction';

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
        userId: user.id,
        username: user.getUsername(),
        parseSessionToken: user.getSessionToken(),
        email: user.getEmail(),
      };
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

const parseSecurityData = (symbol, data) => {
  const security = new GCSecurity({
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
  return security;
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
      const stockList = [];
      const errorList = [];
      converted.forEach((detailText) => {
        const parts = detailText.split('=');
        const symbol = parts[0].split('_').pop();
        const data = parts[1].split('"')[1].split(',');

        const security = parseSecurityData(symbol, data);
        const validation = security.validate();
        if (validation.error) {
          logger.debug('validation error->', validation.error.details);
          errorList.push(security);
        } else {
          stockList.push(security);
        }
      });
      return { stockList, errorList };
    })
    .catch((error) => {
      logger.error('SinaStock error: ', error.message);
    });
  },
};

async function AccountNewTransactionsSubmit(req: Request, res: Response, next: NextFunction) {
  const allTrans = req.body.newTransactions;
  logger.debug(typeof allTrans, allTrans);
  const symbolList = Object.keys(allTrans)
    .reduce((prev, key) => {
      const symbol = allTrans[key].symbol;
      // No null or duplicates
      if (symbol && !prev.includes(symbol)) {
        return [symbol, ...prev];
      }
      return prev;
    }, []);

  if (symbolList.length > 0) {
    const lookupResult = await SinaStock.lookup(symbolList);
    const stockList = lookupResult.stockList;
    // const errorList = lookupResult.errorList;
    // logger.debug('AccountNewTransactionsSubmit.stockList------>', stockList[0].simple());
    // logger.debug('AccountNewTransactionsSubmit.errorList------>', errorList[0].simple());
    logger.debug('AccountNewTransactionsSubmit.jwt------>', req.jwt);

    // 400 with error list
    if (lookupResult.errorList.length > 0) {
      res.status(400).send(lookupResult.errorList).end();
      return;
    }

    // Proceed if successfully parsed all securities
    // Update Security table
    const securityObjectList = await Promise.all(stockList.map(async (stock) => {
      const results = await GCSecurityUtil.find(stock.symbol);
      if (results.length === 0) {
        const security = await GCSecurityUtil.add(stock);
        return { key: [stock.symbol], value: security };
      } else if (results.length > 1) {
        logger.debug('Found duplicates. Remove old ones.');
        await GCSecurityUtil.deleteAll(results.slice(1));
      }
      const target = results[0];
      const security = await GCSecurityUtil.update(target, stock);
      return { key: [stock.symbol], value: security };
    }))
    // Turn array into a map
    .then((result) => {
      return result.reduce((map, obj) => {
        map[obj.key] = obj.value;
        return map;
      }, {});
    });
    logger.debug('securityObjectList: ', securityObjectList);

    // Get the user
    const queryUser = new Parse.Query(Parse.User);
    const user = await queryUser.get(req.jwt.userId)
      .then((obj) => {
        logger.debug('get user done: ', obj);
        return obj;
      }, (error) => {
        logger.debug('get user failed: ', error);
      });

    // Save to OpenPosition
    const OpenPosition = Parse.Object.extend('OpenPosition');
    await Promise.all(Object.keys(allTrans).map((key) => {
      const trans = new GCTransaction(allTrans[key]);
      logger.debug('trans==>', trans.simple());
      const openPosition = new OpenPosition();
      openPosition.set('security', securityObjectList[trans.symbol]);
      openPosition.set('buyingPrice', trans.price);
      openPosition.set('quantity', trans.quantity);
      openPosition.set('date', trans.date);
      openPosition.set('note', trans.note);
      openPosition.set('owner', user);
      return openPosition.save(null)
      .then((obj) => {
        logger.debug('openPosition added: ', obj);
        return obj;
      }, (error) => {
        logger.debug('openPosition add error:', error);
      });
      // logger.debug('openPosition-->', openPosition);
    }));

    logger.debug('finished all!!!');

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
