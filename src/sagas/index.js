// ／@flow
/* eslint-disable no-constant-condition */

// import { take, put, call, fork, select } from 'redux-saga/effects';
import { take, fork } from 'redux-saga/effects';

import Actions from '../actions';
import API from './api';

function* login() {
  while (true) {
    const { username, password } = yield take(Actions.LOGIN.REQUEST);
    console.log('saga-------->', username, password);

    API.login();
  }
}

export default function* root() {
  yield [
    fork(login),
  ];
}
