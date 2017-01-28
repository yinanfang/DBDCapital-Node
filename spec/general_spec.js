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
    waitTimeout: 3000,
    switches: {
      'ignore-certificate-errors': true,
    },
  });
  if (platform === MOBILE) {
    nightmare.useragent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16');
    nightmare.viewport(420, 740);
  } else {
    // nightmare.viewport(960, 660);
    nightmare.viewport(1080, 860);
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

const testUserClient = {
  username: 'dbdcapital_test',
  password: 'password',
  email: 'dbdcapital_test@dbd-capital.com',
};

const testUserParse = {
  username: 'lucas',
  password: 'test',
};

describe('Node Sever API v1.0 Test', () => {
  it('/register', (done) => {
    requestNodeAPI.post('/register')
      .send(testUserClient)
      .expect(200)
      .end((err, res) => {
        logger.info(res.body);
        errorHandler(done, err);
      });
  });

  it('/login', (done) => {
    requestNodeAPI.post('/login')
      .send(testUserClient)
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

  it('/non-existing-url should 404', (done) => {
    requestNodeAPI.get('/non-existing-url')
      .expect(404)
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

describe('Automated browser Test for Web Client', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Desktop Web Adam Login + Submit New Transactions + View Open Position should work fine', (done) => {
    const browser = getBrowser();
    const patternFormNewTransactions = 'form[name="newTransactions"] div:nth-child(2) td:nth-child';
    browser
      // Go to Home page
      .goto(Config.SERVER_URL)
      .wait('a[href="/auth"]')
      // Go to Auth page and log in
      .click('a[href="/auth"]')
      .wait('form[name="login"]')
      .type('form[name="login"] input[name="username"]', testUserClient.username)
      .type('form[name="login"] input[name="password"]', testUserClient.password)
      .click('form[name="login"] button[type="submit"]')
      // Go to Account/Admin, fill out first row, and submit
      .wait('div[class*="__accountBase__"]')
      .click('a[href="/account/admin"]')
      .wait('form[name="newTransactions"]')
      .click(`${patternFormNewTransactions}(1) input`)
      .type(`${patternFormNewTransactions}(3) input`, '102d')
      .type(`${patternFormNewTransactions}(4) input`, '600635')
      .type(`${patternFormNewTransactions}(5) input`, '22')
      .type(`${patternFormNewTransactions}(7) textarea:nth-child(2)`, 'Random note')
      .click('div[class*="accountSectionContainer"]:nth-child(1) button[type="submit"]')
      .wait(2000)
      .end()
      .then(() => {
        errorHandler(done);
      })
      .catch((err) => {
        errorHandler(done, err);
      });
  });
});

describe('Automated browser Test for Parse Dashboard', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Parse Dashboard should work fine', (done) => {
    const browser = getBrowser();
    browser
      .goto(`${Config.PARSE_SERVER_BASE}/dashboard/login`)
      .wait('form[action="/dashboard/login"]')
      .type('form[action="/dashboard/login"] input[name="username"]', testUserParse.username)
      .type('form[action="/dashboard/login"] input[name="password"]', testUserParse.password)
      .click('form[action="/dashboard/login"] input[type="submit"]')
      .wait('ul[class^="apps__"]')
      .click('ul[class^="apps__"] a')
      .wait('div[class^="toolbar__"]')
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
      .send(testUserClient)
      .expect(200)
      .end((err, res) => errorHandler(done, err));
  });
});
