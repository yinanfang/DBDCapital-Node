import request from 'supertest';
import jwt from 'jsonwebtoken';

import logger from '../utils/logger';
import Config from '../config';
import TestUtil from './TestUtil';

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
});

/* ***************************************************************************
Main Test
*****************************************************************************/

describe('Node Sever API v1.0 Test Main', () => {
  it('/register', (done) => {
    requestNodeAPI.post('/register')
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

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
});


/* ***************************************************************************
Cleanup - Delete test user
*****************************************************************************/

describe('Node Sever API v1.0 Test Main Cleanup', () => {
  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});
