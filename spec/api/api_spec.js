import request from 'supertest';
import jwt from 'jsonwebtoken';

import logger from '../../utils/logger';
import API from '../../api/v1.0';

const baseUrl = 'https://localhost:3000';
const APIUrl = 'https://localhost:3000/api/v1.0';


const errorHandler = (err, res, done) => {
  if (err) done.fail(err);
  else done();
};

// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('Website Monitoring Test', () => {
  it('Home page should 200', (done) => {
    request(baseUrl).get('/')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('Account page should 200', (done) => {
    request(baseUrl).get('/account')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });
});

describe('Parse server Test', () => {
  it('Dashboard should 200', (done) => {
    request(baseUrl).get('/dashboard/apps')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('Should be able to see User table', (done) => {
    request(baseUrl).get('/dashboard/apps/DBD%20Capital/browser/_User')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });
});

let receivedToken = '';

describe('API v1.0 Test', () => {
  it('/register', (done) => {
    request(APIUrl).get('/register')
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('/login', (done) => {
    request(APIUrl).get('/login')
      .expect(200)
      .expect((res) => {
        receivedToken = API.getJWTFromRequest(res);
        const decoded = jwt.decode(receivedToken);
        logger.debug(decoded);
      })
      .end((err, res) => errorHandler(err, res, done));
  });

  it('/user with correct token', (done) => {
    request(APIUrl).get('/user')
      .set('Authorization', `Bearer ${receivedToken}`)
      .expect(200)
      .end((err, res) => errorHandler(err, res, done));
  });

  it('/user with wrong token', (done) => {
    request(APIUrl).get('/user')
      .set('Authorization', 'Bearer wrong-toekn')
      .expect(302)
      .end((err, res) => errorHandler(err, res, done));
  });
});
