// ／@flow
/* eslint-disable no-constant-condition */

import { take, fork, call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import Actions from '../actions';
import API from './api';

function* login() {
  while (true) {
    const { username, password } = yield take(Actions.LOGIN.REQUEST);
    const token = yield call(API.login, username, password);
    console.log('here!');
    if (token) {
      yield put(Actions.login.success(token));
      yield put(Actions.navigate('/account'));
    } else {
      yield put(Actions.login.failure(username, 'saga-api-failure'));
    }
  }
}

function* account() {
  while (true) {
    // TODO: Cancel previous request if there's new one
    yield take(Actions.ACCOUNT_INFO.REQUEST);
    console.log('---->sss', Actions.loading.update(true));
    yield put(Actions.loading.update(true));
    const result = yield call(API.account, 'accountId', {});
    yield put(Actions.loading.update(false));
  }
}

function* accountOverviewRequest() {
  while (true) {
    yield take(Actions.ACCOUNT_OVERVIEW.REQUEST);
    console.log('---->sss');
  }
}

function* accountNewTransactionsSubmit() {
  while (true) {
    const { newTransactions, account } = yield take(Actions.ACCOUNT_NEW_TRANSACTIONS.SUBMIT);
    const result = yield call(API.accountNewTransactionsSubmit, newTransactions, account);
  }
}

/* ***************************************************************************
Utility
*****************************************************************************/

// trigger router navigation via history
function* watchNavigate() {
  while (true) {
    const { pathname } = yield take(Actions.NAVIGATE);
    yield browserHistory.push(pathname);
  }
}

export default function* root() {
  yield [
    // Feature
    fork(login),
    fork(account),
    fork(accountOverviewRequest),
    fork(accountNewTransactionsSubmit),
    // Utility
    fork(watchNavigate),
  ];
}
