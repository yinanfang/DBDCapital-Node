// @flow

import request from 'supertest';

import Path from '../path';
import TestUtil from './TestUtil';
import Config from '../config';

const requestNodeServer = request(Config.SERVER_URL);

// Needs to call done()
// https://github.com/visionmedia/supertest/issues/283#issuecomment-149450240
describe('Website Monitoring Test - Asynchronous', () => {
  Path.DBDCapital.RoutesUnsecure.forEach((route) => {
    it(`Testing ${route}`, (done) => {
      requestNodeServer.get(route)
        .expect(200)
        .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
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
          .end((err, res) => TestUtil.GeneralErrorHandler(done, err));
      });
    })(route);
  });
});
