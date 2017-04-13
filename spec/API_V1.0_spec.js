// @flow

import request from 'supertest';
import jwt from 'jsonwebtoken';

import logger from '../utils/logger';
import Config from '../config';
import TestUtil from './TestUtil';
import DBPosition from '../api/v1.0/db/DBPosition';
import DBSecurity from '../api/v1.0/db/DBSecurity';

const requestNodeAPI = request(Config.SERVER_API_BASE);
const requestParseCloudAPI = request(Config.PARSE_CLOUD_API_BASE);

let receivedToken = '';

/* ***************************************************************************
Setup - Register test user
*****************************************************************************/

describe('Node Sever API v1.0 Test Setup', () => {
  it('should be able to register the test user', (done) => {
    requestNodeAPI.post('/register')
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  // TODO: set admin right for test user
});

/* ***************************************************************************
Main Test
*****************************************************************************/

describe('Node Sever API v1.0 Test - Sanity Checks', () => {
  it('/login', (done) => {
    requestNodeAPI.post('/login')
      .send(TestUtil.TestUser)
      .expect(200)
      .expect((res) => {
        receivedToken = res.body.token;
        const decoded = jwt.decode(receivedToken);
        logger.debug(`----------------${JSON.stringify(decoded)}`);
      })
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('/user with correct token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', `Bearer ${receivedToken}`)
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
      .set('Authorization', `Bearer ${receivedToken}`)
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
    } catch (err) {
      TestUtil.GeneralErrorHandler(done, err);
    }
    done();
  });

  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});
