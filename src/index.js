// @flow
/* eslint-disable no-underscore-dangle */

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Raven from 'raven-js';
import 'autotrack'; // Google Analytics
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import rootSaga from './sagas';

Raven
  .config('https://ba2c52ba612b44fa992d13c78771955b@sentry.io/108549')
  .install();
// Raven.captureMessage('Test!');

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSaga);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
