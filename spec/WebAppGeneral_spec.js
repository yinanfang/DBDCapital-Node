import request from 'supertest';

import Config from '../config';
import TestUtil from './TestUtil';

const requestNodeAPI = request(Config.SERVER_API_BASE);
const requestParseCloudAPI = request(Config.PARSE_CLOUD_API_BASE);

/* ***************************************************************************
Setup - Register test user
*****************************************************************************/
describe('Web App Test Setup', () => {
  it('should be able to register the test user', (done) => {
    requestNodeAPI.post('/register')
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => {
        TestUtil.GeneralErrorHandler(done, err);
      });
  });
});


/* ***************************************************************************
Main Test
*****************************************************************************/

describe('Automated browser Test for Web Client', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Desktop Web Admin Login + Submit New Transactions + View Open Position should work fine', (done) => {
    const browser = TestUtil.getBrowser();
    const patternFormNewTransactions = 'form[name="newTransactions"] div:nth-child(2) td:nth-child';
    browser
      // Go to Home page
      .goto(Config.SERVER_URL)
      .wait('a[href="/auth"]')
      // Go to Auth page and log in
      .click('a[href="/auth"]')
      .wait('form[name="login"]')
      .type('form[name="login"] input[name="username"]', TestUtil.TestUser.username)
      .type('form[name="login"] input[name="password"]', TestUtil.TestUser.password)
      .click('form[name="login"] button[type="submit"]')
      // Go to Account/Admin, fill out first row, and submit
      .wait('div[class*="__accountBase__"]')
      .click('a[href="/account/admin"]')
      .wait('form[name="newTransactions"]')
      .click(`${patternFormNewTransactions}(1) input`)
      .type(`${patternFormNewTransactions}(3) input`, '102d')
      .type(`${patternFormNewTransactions}(4) input`, '600635')
      .type(`${patternFormNewTransactions}(7) input`, '22')
      .type(`${patternFormNewTransactions}(8) input`, '100')
      .type(`${patternFormNewTransactions}(9) input`, '2.1')
      .type(`${patternFormNewTransactions}(10) textarea:nth-child(2)`, 'Random note')
      .click('div[class*="accountSectionContainer"]:nth-child(1) button[type="submit"]')
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});


/* ***************************************************************************
Cleanup - Delete test user
*****************************************************************************/

describe('Parse-Sever API v1.0 Test', () => {
  it('should be able to delete the test user', (done) => {
    requestParseCloudAPI.post('/deleteUser')
      .set('X-Parse-Application-Id', Config.PARSE_APP_ID)
      .send(TestUtil.TestUser)
      .expect(200)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});
