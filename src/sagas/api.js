// @flow

import 'isomorphic-fetch';
import request from 'axios';
import Raven from 'raven-js';

import Path from '../../path';
import type { GCNewTransactionInputType } from '../../model/GCTransaction';
import Actions from '../actions';
import GCAPIConstant from '../../api/v1.0/GCAPIConstant';

const login = (username: string, password: string) => {
  console.log(`src/api.js-------> ${Path.API.basePath}/login`);
  return request
    .post(`${Path.API.basePath}/login`, {
      username,
      password,
    })
    .then((response) => {
      return response.data.token;
    })
    .catch((error) => {
      console.log('Login failed!');
      Raven.captureException(error);
      return null;
    });
};

const user = (token: string) => {
  console.log(`src/api.js-------> ${Path.API.basePath}/user`);
  return fetch(`${Path.API.basePath}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      token,
    }),
  })
  .catch((ex) => {
    console.log(' failed', ex);
    return null;
  });
};

const account = {
  single: {
    info: (accountId: string, scope: {}): {} => {
      console.log('saga API account...');
      return request
        .post(`${Path.API.basePath}/account`, {
          action: Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.REQUEST,
          accountId,
        })
        .then((response) => {
          console.log('account info succeeded!');
          return response.data;
        });
    },
  },
  multi: {
    allAccounts: (scope: string = GCAPIConstant.Account.BASIC_INFO) => {
      // console.log('saga API allAccounts...');
      return request
        .post(`${Path.API.basePath}/account`, {
          action: Actions.ACCOUNT.MULTI.ALL_ACCOUNTS.REQUEST,
          scope,
        })
        .then((response) => {
          // console.log('account allAccounts succeeded!');
          return response.data.entities.accounts;
        });
    },
  },
};

const accountNewTransactionsSubmit = (newTransactions: { [key: string]: GCNewTransactionInputType }, accountId: string) => {
  console.log('accountNewTransactionsSubmitted...');
  return request
    .post(`${Path.API.basePath}/account/newTransactions`, {
      accountId,
      newTransactions,
    })
    .then((response) => {
      if (response.status === 200) {
        console.log('accountNewTransactionsSubmit succeed!');
      } else {
        console.log('accountNewTransactionsSubmit response');
        console.log(response);
      }
      return response.data;
    })
    .catch((error) => {
      console.log('accountNewTransactionsSubmit failed!');

      // TODO: handle auth fail situation. Add User message

      Raven.captureException(error);
      return null;
    });
};

export default {
  login,
  user,
  account,
  accountNewTransactionsSubmit,
};
