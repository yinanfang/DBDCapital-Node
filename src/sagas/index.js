// ／@flow
/* eslint-disable no-constant-condition */

import { take, fork, call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import actions from '../actions';
import API from './api';

function* login() {
  while (true) {
    const { username, password } = yield take(actions.LOGIN.REQUEST);
    const token = yield call(API.login, username, password);
    console.log('here!');
    if (token) {
      yield put(actions.login.success(token));
      yield put(actions.navigate('/account'));
    } else {
      yield put(actions.login.failure(username, 'saga-api-failure'));
    }
  }
}

function* accountNewTransactionsSubmit() {
  while (true) {
    const { newTransactions } = yield take(actions.ACCOUNT_NEW_TRANSACTIONS.SUBMIT);
    const result = yield call(API.accountNewTransactionsSubmit, newTransactions);
  }
}

/* ***************************************************************************
Utility
*****************************************************************************/

// trigger router navigation via history
function* watchNavigate() {
  while (true) {
    const { pathname } = yield take(actions.NAVIGATE);
    yield browserHistory.push(pathname);
  }
}

export default function* root() {
  yield [
    // Feature
    fork(login),
    fork(accountNewTransactionsSubmit),
    // Utility
    fork(watchNavigate),
  ];
}
