import request from 'supertest';
import jwt from 'jsonwebtoken';

import logger from '../../utils/logger';
import API from '../../api/v1.0';
import { SERVER_URL, SERVER_API_BASE, PARSE_CLOUD_API_BASE, PARSE_APP_ID } from '../../config';

const errorHandler = (err, res, done) => {
  if (err) done.fail(err);
  else done();
};

const requestNodeServer = request(SERVER_URL);
const requestNodeAPI = request(SERVER_API_BASE);
const requestParseCloudAPI = request(PARSE_CLOUD_API_BASE);


// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('Website Monitoring Test', () => {
  it('Home page should 200', (done) => {
    requestNodeServer.get('/')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('Account page should 200', (done) => {
    requestNodeServer.get('/account')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });
});

describe('Parse server Test', () => {
  it('Dashboard should 200', (done) => {
    requestNodeServer.get('/dashboard/apps')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('Should be able to see User table', (done) => {
    requestNodeServer.get('/dashboard/apps/DBD%20Capital/browser/_User')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
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
        receivedToken = API.getJWTFromRequest(res);
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
      .expect(302)
      .end((err, res) => errorHandler(err, res, done));
  });
});

describe('Parse-Sever API v1.0 Test', () => {
  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', PARSE_APP_ID)
      .send(testUser)
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });
});
