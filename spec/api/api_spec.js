// @flow

import request from 'supertest';
import jwt from 'jsonwebtoken';

import logger from '../../utils/logger';
import API from '../../api/v1.0';
import Util from '../../utils';
import Config from '../../config';
import Path from '../../path';

const errorHandler = (err, res, done) => {
  if (err) done.fail(err);
  else done();
};

const requestNodeServer = request(Config.SERVER_URL);
const requestNodeAPI = request(Config.SERVER_API_BASE);
const requestParseDashboard = request(Config.PARSE_SERVER_BASE);
const requestParseCloudAPI = request(Config.PARSE_CLOUD_API_BASE);

// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('Website Monitoring Test - Asynchronous', () => {
  Path.DBDCapital.RoutesUnsecure.forEach((route) => {
    it(`Testing ${route}`, (done) => {
      requestNodeServer.get(route)
        .expect(200)
        .end((err, res) => errorHandler(err, res, done));
    });
  });
});

// Sync test with order: http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters/23635357#23635357
describe('Website Monitoring Test - Synchronous', () => {
  Path.DBDCapital.RoutesUnsecure.forEach((route) => {
    (() => {
      it(`Testing ${route}`, (done) => {
        requestNodeServer.get(route)
          .expect(200)
          .end((err, res) => errorHandler(err, res, done));
      });
    })(route);
  });
});

let receivedToken = '';

const testUser = {
  username: 'dbdcapital_test',
  password: 'password',
  email: 'dbdcapital_test@dbd-capital.com',
};

describe('Node Sever API v1.0 Test', () => {
  it('/register', (done) => {
    requestNodeAPI.post('/register')
      .send(testUser)
      .expect(200)
      .end((err, res) => {
        logger.info(res.body);
        errorHandler(err, res, done);
      });
  });

  it('/login', (done) => {
    requestNodeAPI.post('/login')
      .send(testUser)
      .expect(200)
      .expect((res) => {
        receivedToken = Util.getJWTFromHttpObject(res);
        const decoded = jwt.decode(receivedToken);
        logger.debug(`----------------${JSON.stringify(decoded)}`);
      })
      .end((err, res) => errorHandler(err, res, done));
  });

  it('/user with correct token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', `Bearer ${receivedToken}`)
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('/user with wrong token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', 'Bearer wrong-toekn')
      .expect(401)
      .end((err, res) => errorHandler(err, res, done));
  });
});

describe('Parse server Test', () => {
  it('Dashboard should 302', (done) => {
    requestParseDashboard.get('/dashboard/apps')
      .expect(302)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('Should be able to see User table', (done) => {
    requestParseDashboard.get('/dashboard/apps/DBD%20Capital/browser/_User')
      .expect(302)
      .end((err, res) => errorHandler(err, res, done));
  });
});

describe('Parse-Sever API v1.0 Test', () => {
  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(testUser)
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });
});
