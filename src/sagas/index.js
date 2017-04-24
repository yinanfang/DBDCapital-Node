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
    yield take(Actions.ACCOUNT.INFO.REQUEST);
    console.log('saga/index.js - account');
  }
}

function* accountOverviewInfoRequest() {
  while (true) {
    yield take(Actions.ACCOUNT.OVERVIEW.INFO.REQUEST);
    console.log('---->sss');
  }
}

function* accountAdminTargetAccount() {
  while (true) {
    // TODO: Cancel previous request if there's new one
    const { accountId } = yield take(Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.REQUEST);
    yield put(Actions.loading.update(true));
    const accountInfo = yield call(API.account.info, accountId);
    console.log('account info result', accountInfo);
    yield put(Actions.account.admin.targetAccount.success(accountInfo));
    yield put(Actions.loading.update(false));
  }
}

function* accountAdminNewTransactionsSubmit() {
  while (true) {
    const { newTransactions, accountId } = yield take(Actions.ACCOUNT.ADMIN.NEW_TRANSACTIONS.SUBMIT);
    const result = yield call(API.accountNewTransactionsSubmit, newTransactions, accountId);
    console.log('accountNewTransactionsSubmit result', result);
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
    fork(accountOverviewInfoRequest),
    fork(accountAdminTargetAccount),
    fork(accountAdminNewTransactionsSubmit),
    // Utility
    fork(watchNavigate),
  ];
}
