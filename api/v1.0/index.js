// @flow

import jwt from 'jsonwebtoken';
import Parse from 'parse/node';
import { Request, Response, NextFunction } from 'express';
// import _ from 'lodash';
import Promise from 'bluebird';

import GCAPIConstant from './GCAPIConstant';
import Config from '../../config';
import logger from '../../utils/logger';
import GCSecurity from '../../model/GCSecurity';
import { GCSecurityUtil, GCUserUtil, SinaStock } from './GCAPIUtil';
import GCTransaction from '../../model/GCTransaction';
import GCAccount from '../../model/GCAccount';
import GCUser, { Role as GCUserRole } from '../../model/GCUser';
import DBPosition from './db/DBPosition';
import Actions from '../../src/actions';

/* ***************************************************************************
Auth
*****************************************************************************/

const Register = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`in register...${JSON.stringify(req.body)}`);

  const newUser = new Parse.User();
  Object.keys(req.body).forEach((key) => {
    newUser.set(key, req.body[key]);
  });
  // Default type to client
  newUser.set('type', GCUserRole.CLIENT);

  newUser.signUp(null, {
    success: (user) => {
      logger.debug(`sign up successfully...${JSON.stringify(user)}`);
      const userInfo = GCUser.simplifyParseObject(user);
      res.status(200).json(userInfo);
    },
    error: (user, error) => {
      logger.debug(`sign up failed...${user} - ${error.code} - ${error.message} - ${Config.PARSE_SERVER_URL} - ${Config.PARSE_APP_ID}`);
      res.status(400).send('Fail...');
    },
  });
};

/**
 * Example Return (decrypted)
 * {  "_id":"FC8JmpunDB",
 *    "username":"dbdcapital_test",
 *    "type":"admin",
 *    "iat":1492937123}
 */
const Login = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`API/Login---->${JSON.stringify(req.body)}--${req.body.username}==>${req.body.password}`);
  Parse.User.logIn(req.body.username, req.body.password)
    .then((user) => {
      logger.info(`Login success - ${user.constructor.name} - ${JSON.stringify(user)}`);
      const originalJWTPayload = GCUser.simplifyParseObject(user);
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

async function AccountCreateRequest(req: Request, res: Response) {
  logger.debug('Actions.ACCOUNT.CREATE.REQUEST!!!', req.body);
  const newAccountInfo = req.body.account;
  const owner = await GCUserUtil.find(newAccountInfo.ownerId);
  const PAccount = Parse.Object.extend('Account');
  let newAccount = new PAccount();
  newAccount.set('name', newAccountInfo.name);
  newAccount.set('owner', owner);
  newAccount.set('stockBuyFeeRate', newAccountInfo.stockBuyFeeRate);
  newAccount.set('stockSellFeeRate', newAccountInfo.stockSellFeeRate);
  newAccount = await newAccount.save()
    .then((obj) => {
      logger.debug('newAccount added: ', obj);
      return obj;
    }, (error) => {
      logger.debug('newAccount add error:', error);
      res.status(400).json(error);
    });
  const payload = GCAccount.simplifyParseObject(newAccount);
  res.status(200).json(payload);
}

/**
 * [Account description]
 *
 * if jwt.type = GCUserRole.Admin {
 *  req.body = {
 *    action: [
 *      ACCOUNT.INFO.REQUEST
 *      | ACCOUNT.ADD.REQUEST
 *    ]
 *  }
 * }
 * Example Return:
 * { _id: 'oDAutDGYcs',
 *   name: 'Client Account',
 *   owner: { _id: 'ihiRD21gO6', username: 'dbdcapital_test', type: 'admin' },
 *   stockBuyFeeRate: 0.0052,
 *   stockSellFeeRate: 0.0021,
 *   _updatedAt: '2017-04-23T08:41:58.267Z',
 *   _createdAt: '2017-04-23T08:41:58.267Z',
 *  }
 *
 * jwt.type = GCUserRole.Client
 *

 */
async function AccountInfoSingleRequest(req: Request, res: Response) {
  // Check param
  if (req.body.accountId == null) {
    res.status(400).json({ error: 'Missing req.body.accountId!' });
    return;
  }
  // Handle request
  logger.debug('AccountInfoSingleRequest!!!');
  const PAccount = Parse.Object.extend('Account');
  const queryAccount = new Parse.Query(PAccount);
  queryAccount.include('owner');
  const result = await queryAccount.get(req.body.accountId,
    r => r,
    (r, error) => {
      logger.error(`DB Account query fail - ${JSON.stringify(r)} - ${JSON.stringify(error)}`);
    })
    // Catch non-error rejection
    .catch(err => err);
  console.log('/account result', result, typeof result, JSON.stringify(result));

  // Parse non-error rejection
  if (result.code === 101) {
    logger.error(`/account result non-error rejection ${JSON.stringify(result)}`);
    res.status(400).json(result);
    return;
  }

  const payload = GCAccount.simplifyParseObject(result);
  console.log('payload', payload);
  res.status(200).json(payload);
}

/**
 * Return all account basic info
 * @param {[type]} req [description]
 * @param {[type]} res [description]
 */
async function AccountInfoMultipleRequest(req: Request, res: Response) {
  // Check param
  if (req.body.scope == null) {
    res.status(400).json({ error: 'Missing req.body.scope!' });
    return;
  }
  // Handle request
  logger.debug('AccountInfoMultipleRequest!!!');
  if (req.body.scope === GCAPIConstant.Account.BASIC_INFO) {
    const PAccount = Parse.Object.extend('Account');
    const queryAccount = new Parse.Query(PAccount);
    queryAccount.include('owner');
    queryAccount.include('email');
    const results = await queryAccount.find(
      rs => rs,
      (rs, error) => {
        logger.error(`DB Account query fail - ${JSON.stringify(rs)} - ${JSON.stringify(error)}`);
      })
      // Catch non-error rejection
      .catch(err => err);
    console.log('/account results', results, typeof results, JSON.stringify(results));

    // Parse non-error rejection
    if (results.code === 101) {
      logger.error(`/account result non-error rejection ${JSON.stringify(results)}`);
      res.status(400).json(results);
      return;
    }

    const payload = results.map(r => GCAccount.simplifyParseObject(r));
    console.log('payload', payload);
    res.status(200).json(payload);
  } else {
    const msg = '/account AccountInfoMultipleRequest unknown error';
    logger.error(msg);
    res.status(400).json({ error: msg });
  }
}

async function Account(req: Request, res: Response, next: NextFunction) {
  logger.debug('API /Account started with jwt------>', req.jwt);
  logger.debug('API /Account started with req.body------>', req.body);
  if (req.jwt.type === GCUserRole.ADMIN) {
    logger.debug('admin!!!');
    if (req.body.action === Actions.ACCOUNT.ADD.REQUEST) {
      await AccountCreateRequest(req, res);
    } else if (req.body.action === Actions.ACCOUNT.INFO.REQUEST || req.body.action === Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.REQUEST) {
      await AccountInfoSingleRequest(req, res);
    } else if (req.body.action === Actions.ACCOUNT.MULTI.ALL_ACCOUNTS.REQUEST) {
      await AccountInfoMultipleRequest(req, res);
    }
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

const DeleteUser = (req: Request, res: Response, next: NextFunction) => {
  res.send('Delete User!!!');
};

/* ***************************************************************************
Account
*****************************************************************************/

async function AccountOverview(req: Request, res: Response, next: NextFunction) {
  logger.debug('finished all!!!');
}

async function AccountNewTransactionsSubmit(req: Request, res: Response, next: NextFunction) {
  if (!req.body.newTransactions) {
    res.sendStatus(400).send({ message: 'Client-side error. Missing transactions' });
  }

  logger.debug('AccountNewTransactionsSubmit start with jwt------>', req.jwt);
  logger.debug('AccountNewTransactionsSubmit request body', req.body);
  const allTrans = req.body.newTransactions;
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
    const lookupResult: {stockList: GCSecurity[], errorList: GCSecurity[]} = await SinaStock.lookup(symbolList);
    const stockList = lookupResult.stockList;

    // 400 with error list
    if (lookupResult.errorList.length > 0) {
      res.status(400).send(lookupResult.errorList).end();
      logger.warn('lookupResult.errorList.length > 0. Returning 400');
      return;
    }

    // Update Security table
    const securityObjectList: {key: string, value: any} = await GCSecurityUtil.updateAll(stockList);
    logger.debug('securityObjectList: ', securityObjectList);

    // TODO: return 400 if GCSecurityUtil.updateAll fails

    // Get the user
    const user = await GCUserUtil.find(req.jwt._id);

    // Add open positions
    const Position = Parse.Object.extend('Position');
    await Promise.all(Object.keys(allTrans).map((key) => {
      const trans = new GCTransaction(allTrans[key]);
      logger.debug('trans==>', trans.simple());
      const position = new Position();
      position.set('closed', false);
      position.set('date', trans.date);
      position.set('transId', trans.transId);
      position.set('security', securityObjectList[trans.symbol]);
      position.set('action', trans.action);
      position.set('price', trans.price);
      position.set('quantity', trans.quantity);
      position.set('fee', trans.fee);
      position.set('note', trans.note);
      // position.set('account', 'account'); // TODO: retrieve the right account
      return position.save(null)
        .then((obj) => {
          logger.debug('position added: ', obj);
          return obj;
        }, (error) => {
          logger.debug('position add error:', error);
        });
    }));

    // TODO: Close Position accoding to account, not user

    // Check Position table and move closed positions
    const positionCheckQuery = new Parse.Query(Position);
    positionCheckQuery.equalTo('owner', user);

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
        },
      })
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
            _updated_at: new Date(), // UTC
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

    res.status(200).json({ message: 'Success!' });
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
  Account,
  DeleteUser,
  AccountOverview,
  AccountNewTransactionsSubmit,
  Quote,
  Error,
};
