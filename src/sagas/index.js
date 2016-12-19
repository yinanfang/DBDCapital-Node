// ／@flow
/* eslint-disable no-constant-condition */

// import { take, put, call, fork, select } from 'redux-saga/effects';
import { take, fork, call, put } from 'redux-saga/effects';

import Actions from '../actions';
import API from './api';

function* login() {
  while (true) {
    const { username, password } = yield take(Actions.LOGIN.REQUEST);
    const token = yield call(API.login, username, password);
    if (token) {
      yield put(Actions.login.success(token));
    } else {
      yield put(Actions.login.failure(username, 'saga-api-failure'));
    }
  }
}

export default function* root() {
  yield [
    fork(login),
  ];
}
