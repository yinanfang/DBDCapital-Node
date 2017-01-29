import 'isomorphic-fetch';
import request from 'axios';
import Raven from 'raven-js';

import Path from '../../path';

const login = (username, password) => {
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

const user = (token) => {
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

const accountNewTransactionsSubmit = (newTransactions) => {
  console.log('accountNewTransactionsSubmitted...');
  return request
    .post(`${Path.API.basePath}/account/newTransactions`, {
      newTransactions,
    })
    .then((response) => {
      console.log('accountNewTransactionsSubmit response');
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log('accountNewTransactionsSubmit failed!');
      Raven.captureException(error);
      return null;
    });
};

export default {
  login,
  accountNewTransactionsSubmit,
};
