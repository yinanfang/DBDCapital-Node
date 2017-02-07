// @flow

import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import request from 'request-promise';
import iconv from 'iconv-lite';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import Promise from 'bluebird';

import Config from '../../config';
import logger from '../../utils/logger';
import { GCSecurityUtil } from './GCAPIUtil';
import GCObject from '../../model/GCObject';
import GCSecurity from '../../model/GCSecurity';
import GCTransaction from '../../model/GCTransaction';
import DBPosition from './db/DBPosition';

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
  logger.debug('AccountNewTransactionsSubmit start with jwt------>', req.jwt);
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

    // logging
    // logger.debug('lookupResult.stockList-------->');
    // GCObject.printSimpleArray(lookupResult.stockList);
    // logger.debug('lookupResult.errorList-------->');
    // GCObject.printSimpleArray(lookupResult.errorList);

    // 400 with error list
    if (lookupResult.errorList.length > 0) {
      res.status(400).send(lookupResult.errorList).end();
      logger.warn('lookupResult.errorList.length > 0. Returning 400');
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

    // Add open positions
    const Position = Parse.Object.extend('Position');
    await Promise.all(Object.keys(allTrans).map((key) => {
      const trans = new GCTransaction(allTrans[key]);
      logger.debug('trans==>', trans.simple());
      const position = new Position();
      position.set('closed', false);
      position.set('transId', trans.transId);
      position.set('action', trans.action);
      position.set('security', securityObjectList[trans.symbol]);
      position.set('price', trans.price);
      position.set('quantity', trans.quantity);
      position.set('date', trans.date);
      position.set('note', trans.note);
      position.set('owner', user);
      return position.save(null)
        .then((obj) => {
          logger.debug('position added: ', obj);
          return obj;
        }, (error) => {
          logger.debug('position add error:', error);
        });
    }));

    // Check Position table and move closed positions
    const positionCheckQuery = new Parse.Query(Position);
    positionCheckQuery.equalTo('owner', user);

    // await openPositionCheckQuery.find()
    //   .then((results) => {
    //     logger.debug('openPositionCheckQuery.results: ', results);
    //     const uniqueKeys = _.uniqBy(results, 'security');
    //     logger.debug('openPositionCheckQuery.uniqueKeys: ', uniqueKeys);
    //   }, (error) => {
    //   });

    // await DBOpenPosition.find({ _p_owner: `_User$${user.id}` })
    //   .then((rrr) => {
    //     // logger.debug('openPositionCheckQuery.rrr: ', rrr[0]._id);
    //     console.log(rrr);
    //   })
    //   .catch((err) => {
    //     logger.debug('Mongoose.error: ', err);
    //   });

    // Get open positions
    const positions = await DBPosition
      .aggregate({
        $match: {
          _p_owner: `_User$${user.id}`,
          closed: false,
        },
      }, {
        $group: {
          _id: '$_p_security',
          currentShares: { $sum: '$quantity' },
        } }
      )
      .then((results) => {
        console.log('Get open positions: ', results);
        return results;
      })
      .catch((err) => {
        logger.debug('Mongoose.error: ', err);
      });

    // Validation
    const { validPositions, invalidPositions } = positions.reduce((map, position) => {
      if (position.currentShares >= 0) {
        map.validPositions.push(position);
      } else {
        map.invalidPositions.push(position);
      }
      return map;
    }, {
      validPositions: [],
      invalidPositions: [],
    });
    console.log('after validation: ', validPositions, invalidPositions);

    // Make sure no negative
    if (invalidPositions.length > 0) {
      res.status(400).send({
        message: 'Open positions quantity <= 0',
        payload: invalidPositions,
      }).end();
      logger.warn('lookupResult.errorList.length > 0. Returning 400');
      return;
    }

    // Close all position where currentShares = 0
    const securitiesToClose = validPositions
      .filter(position => position.currentShares === 0)
      .map(position => position._id);
    console.log('securitiesToClose: ', securitiesToClose);
    if (securitiesToClose.length > 0) {
      await DBPosition
        .update({
          _p_owner: `_User$${user.id}`,
          closed: false,
          _p_security: { $in: securitiesToClose },
        }, {
          $set: {
            closed: true,
            _updated_at: new Date(),
          },
        }, {
          multi: true,
        })
        .then((results) => {
          console.log('update results: ', results);
        })
        .catch((err) => {
          logger.debug('Mongoose.error: ', err);
        });
    }

    logger.debug('finished all!!!');

    res.status(200).send({ message: 'Success!' });
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
