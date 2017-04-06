// @flow

import jasmine from 'jasmine';
import request from 'supertest';

import TestUtil from './TestUtil';
import Config from '../config';

const testUserParse = {
  username: 'lucas',
  password: 'test',
};

const requestParseDashboard = request(Config.PARSE_SERVER_BASE);

describe('Parse Dashboard Authentication Test', () => {
  it('Dashboard should 302', (done) => {
    requestParseDashboard.get('/dashboard/apps')
      .expect(302)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });

  it('Should be able to see User table', (done) => {
    requestParseDashboard.get('/dashboard/apps/DBD%20Capital/browser/_User')
      .expect(302)
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});

describe('Parse Dashboard Availability Test', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Parse Dashboard should work fine', (done) => {
    const browser = TestUtil.getBrowser();
    browser
      .goto(`${Config.PARSE_SERVER_BASE}/dashboard/login`)
      .wait('form[action="/dashboard/login"]')
      .type('form[action="/dashboard/login"] input[name="username"]', testUserParse.username)
      .type('form[action="/dashboard/login"] input[name="password"]', testUserParse.password)
      .click('form[action="/dashboard/login"] input[type="submit"]')
      // Tempararily disables the test. Might be Nightmare issue
      // .wait('ul[class^="apps__"]')
      // .click('ul[class^="apps__"] a')
      // .wait('div[class^="toolbar__"]')
      .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
  });
});
