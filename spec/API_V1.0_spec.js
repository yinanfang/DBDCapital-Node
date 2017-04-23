// @flow

import request from 'supertest';
import jwt from 'jsonwebtoken';
// import Parse from 'parse/node';
import _ from 'lodash';

import logger from '../utils/logger';
import Config from '../config';
import TestUtil from './TestUtil';
import DBPosition from '../api/v1.0/db/DBPosition';
import DBSecurity from '../api/v1.0/db/DBSecurity';
import DBUser from '../api/v1.0/db/DBUser';
import DBAccount from '../api/v1.0/db/DBAccount';
// import { GCUserUtil } from '../api/v1.0/GCAPIUtil';
import { Role as GCUserRole } from '../model/GCUser';
import Actions from '../src/actions';

const requestNodeAPI = request(Config.SERVER_API_BASE);
const requestParseCloudAPI = request(Config.PARSE_CLOUD_API_BASE);

const TestUser = TestUtil.DEFAULT_TEST_USER;

/* ***************************************************************************
Setup - Register test user
*****************************************************************************/

describe('Node Sever API v1.0 Test Setup', () => {
  // it('should be able to init Parse', (done) => {
  //   try {
  //     Parse.initialize(Config.PARSE_APP_ID);
  //     Parse.serverURL = Config.PARSE_SERVER_URL;
  //   } catch (err) {
  //     TestUtil.GeneralErrorHandler(done, err);
  //   }
  //   done();
  // });

  it('should be able to register the test user', async (done) => {
    requestNodeAPI.post('/register')
      .send(TestUser)
      .expect(200)
      .end((err, res) => {
        TestUser._id = res.body._id;
        TestUser.account.ownerId = res.body._id;
        expect(TestUser._id.length > 0).toBeTruthy();
        TestUtil.GeneralErrorHandler(done, err);
      });
  });

  it('should be able to set admin user', async (done) => {
    await DBUser.update({
      username: TestUser.username,
    }, {
      type: GCUserRole.ADMIN,
    })
    .catch(err => TestUtil.GeneralErrorHandler(done, err));

    DBUser.findOne({
      username: TestUser.username,
    })
    .then((adminUser) => {
      expect(adminUser.type).toEqual(GCUserRole.ADMIN);
      done();
      return null;
    })
    .catch(err => TestUtil.GeneralErrorHandler(done, err));
  });
});


/* ***************************************************************************
Main Test
*****************************************************************************/

describe('Node Sever API v1.0 Test - Sanity Checks', () => {
  it('/login', (done) => {
    requestNodeAPI.post('/login')
      .send(TestUser)
      .expect(200)
      .expect((res) => {
        TestUser.token = res.body.token;
        const decoded = jwt.decode(TestUser.token);
        expect(decoded._id).toEqual(TestUser._id);
        expect(decoded.username).toEqual(TestUser.username);
        expect(decoded.type).toEqual(TestUser.type);
        expect(decoded.iat > 0).toBeTruthy();
      })
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('/user with correct token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('/user with wrong token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', 'Bearer wrong-toekn')
      .expect(401)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('/non-existing-url should 404', (done) => {
    requestNodeAPI.get('/non-existing-url')
      .expect(404)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('/account/newTransactions should require authentication', (done) => {
    requestNodeAPI.post('/account/newTransactions')
      .expect(401)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});

const testPosition = {
  date: '2017-03-30T16:00:00.000Z',
  transId: `apiTest${Date.now()}`,
  symbol: 'sh600635',
  action: 'Buy',
  price: 22.34,
  quantity: 150,
  fee: 3.75,
  note: 'demo note',
};

describe('Node Sever API v1.0 Test - General API Tests', () => {
  it('should be able to set up account', async (done) => {
    const { _id, ...newAccountInfo } = TestUser.account; // eslint-disable-line no-unused-vars
    await requestNodeAPI.post('/account')
      .send({
        action: Actions.ACCOUNT.ADD.REQUEST,
        account: newAccountInfo,
      })
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(200)
      .then((res) => {
        TestUser.account._id = res.body._id;
        return null;
      })
      .catch(err => TestUtil.GeneralErrorHandler(done, err));

    DBAccount.find({
      _id: TestUser.account._id,
    })
      .then((results) => {
        expect(results.length).toEqual(1);
        expect(results[0]._id).toEqual(TestUser.account._id);
        expect(results[0].stockBuyFeeRate).toEqual(TestUser.account.stockBuyFeeRate);
        expect(results[0].stockSellFeeRate).toEqual(TestUser.account.stockSellFeeRate);
        expect(results[0]._p_owner).toContain(TestUser.account.ownerId);
        done();
        return null;
      })
      .catch(err => TestUtil.GeneralErrorHandler(done, err));
  });

  it('should NOT able do Actions.ACCOUNT.INFO.REQUEST without accountId', async (done) => {
    requestNodeAPI.post('/account')
      .send({
        action: Actions.ACCOUNT.INFO.REQUEST,
      })
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(400)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('should NOT be able do Actions.ACCOUNT.INFO.REQUEST with wrong accountId', async (done) => {
    requestNodeAPI.post('/account')
      .send({
        action: Actions.ACCOUNT.INFO.REQUEST,
        accountId: 'wrong accountId',
      })
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(400)
      .end((err, res) => {
        expect(_.isEqual(res.body, { code: 101, message: 'Object not found.' })).toBeTruthy();
        TestUtil.GeneralErrorHandler(done, err);
      });
  });

  it('should  be able do Actions.ACCOUNT.INFO.REQUEST with correct accountId', async (done) => {
    requestNodeAPI.post('/account')
      .send({
        action: Actions.ACCOUNT.INFO.REQUEST,
        accountId: TestUser.account._id,
      })
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(200)
      .end((err, res) => {
        const account = res.body;
        expect(account._id).toEqual(TestUser.account._id);
        expect(account.owner._id).toEqual(TestUser.account.ownerId);
        TestUtil.GeneralErrorHandler(done, err);
      });
  });
});

describe('Node Sever API v1.0 Test - Admin Submission Test - /account/newTransactions', () => {
  it('/api/v1.0/account/newTransactions should works fine', (done) => {
    requestNodeAPI.post('/account/newTransactions')
      .send({
        // TODO: retrieve a real account id for test
        account: 'testAccountId',
        newTransactions: {
          [0]: testPosition, // eslint-disable-line no-useless-computed-key
        },
      })
      .set('Authorization', `Bearer ${TestUser.token}`)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  }, 10 * 1000);

  // TODO: insert a few more. Test close & open position

  it('the new transaction should be in Position Table', async (done) => {
    DBPosition.find({
      transId: testPosition.transId,
    })
    .then((results) => {
      expect(results.length).toEqual(1);
      done();
      return null;
    })
    .catch(err => TestUtil.GeneralErrorHandler(done, err));
  });

  it('the stock info in Security Table should be updated after the previous minute', (done) => {
    DBSecurity.find({
      symbol: testPosition.symbol,
    })
    .then((results) => {
      expect(results.length).toEqual(1);
      const today = new Date();
      const minuteAgo = new Date(today.getTime() - (1000 * 60));
      expect(minuteAgo < results[0]._updated_at).toBeTruthy();
      done();
      return null;
    })
    .catch(err => TestUtil.GeneralErrorHandler(done, err));
    done();
  });
});


/* ***************************************************************************
Cleanup - Delete test user
*****************************************************************************/

describe('Node Sever API v1.0 Test Main Cleanup', () => {
  it('should be able to delete all test data', async (done) => {
    try {
      await DBPosition.deleteMany({
        // option m: For patterns that include anchors
        transId: { $regex: /^apiTest.*$/, $options: 'm' },
      });
      await DBAccount.remove({
        _id: TestUser.account._id,
      });
    } catch (err) {
      TestUtil.GeneralErrorHandler(done, err);
    }
    done();
  });

  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});
