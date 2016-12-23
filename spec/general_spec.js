// @flow

import request from 'supertest';
import Nightmare from 'nightmare';
import jwt from 'jsonwebtoken';
import notifier from 'node-notifier';

import logger from '../utils/logger';
import Config from '../config';
import Path from '../path';

const errorHandler = (done, error, res = null) => {
  if (error) {
    notifier.notify({
      title: 'Unexpected Jasmine test error',
      message: error.stack,
      sound: true,
      wait: true,
    });
    logger.error(error.stack);
    done.fail(error);
  } else {
    done();
  }
};

const requestNodeServer = request(Config.SERVER_URL);
const requestNodeAPI = request(Config.SERVER_API_BASE);
const requestParseDashboard = request(Config.PARSE_SERVER_BASE);
const requestParseCloudAPI = request(Config.PARSE_CLOUD_API_BASE);

const MOBILE = 'mobile';
const DESKTOP = 'desktop';

const getBrowser = (platform = DESKTOP) => {
  const nightmare = Nightmare({
    show: true,
    typeInterval: 1,
    waitTimeout: 5000,
    switches: {
      'ignore-certificate-errors': true,
    },
  });
  if (platform === MOBILE) {
    nightmare.useragent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16');
  }
  return nightmare;
};

// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('Website Monitoring Test - Asynchronous', () => {
  Path.DBDCapital.RoutesUnsecure.forEach((route) => {
    it(`Testing ${route}`, (done) => {
      requestNodeServer.get(route)
        .expect(200)
        .end((err, res) => errorHandler(done, err));
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
          .end((err, res) => errorHandler(done, err));
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
        errorHandler(done, err);
      });
  });

  it('/login', (done) => {
    requestNodeAPI.post('/login')
      .send(testUser)
      .expect(200)
      .expect((res) => {
        receivedToken = res.body.token;
        const decoded = jwt.decode(receivedToken);
        logger.debug(`----------------${JSON.stringify(decoded)}`);
      })
      .end((err, res) => errorHandler(done, err));
  });

  it('/user with correct token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', `Bearer ${receivedToken}`)
      .expect(200)
      .end((err, res) => errorHandler(done, err));
  });

  it('/user with wrong token', (done) => {
    requestNodeAPI.get('/user')
      .set('Authorization', 'Bearer wrong-toekn')
      .expect(401)
      .end((err, res) => errorHandler(done, err));
  });
});

describe('Parse server Test', () => {
  it('Dashboard should 302', (done) => {
    requestParseDashboard.get('/dashboard/apps')
      .expect(302)
      .end((err, res) => errorHandler(done, err));
  });

  it('Should be able to see User table', (done) => {
    requestParseDashboard.get('/dashboard/apps/DBD%20Capital/browser/_User')
      .expect(302)
      .end((err, res) => errorHandler(done, err));
  });
});

describe('Automated browser Test', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Login flow should work fine', (done) => {
    const browser = getBrowser();
    browser
      .goto(Config.SERVER_URL)
      .wait('a[href="/auth"]')
      .click('a[href="/auth"]')
      .wait('form[name="login"]')
      .type('form[name="login"] input[name="username"]', testUser.username)
      .type('form[name="login"] input[name="password"]', testUser.password)
      .click('form[name="login"] button[type="submit"]')
      .wait(3000)
      .end()
      .then(() => {
        errorHandler(done);
      })
      .catch((err) => {
        errorHandler(done, err);
      });
  });
});

/* ***************************************************************************
Cleanup - Delete test user
*****************************************************************************/

describe('Parse-Sever API v1.0 Test', () => {
  it('/deleteUser delete test user with username', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(testUser)
      .expect(200)
      .end((err, res) => errorHandler(done, err));
  });
});
