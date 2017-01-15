// @flow

// Reference 01: https://github.com/yelouafi/redux-saga/blob/master/examples/real-world/actions/index.js
// Reference 02: https://engineering.haus.com/so-youve-screwed-up-your-redux-store-or-why-redux-makes-refactoring-easy-400e19606c71#4fed

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createRequestTypes = (base) => {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
};

const REGISTER = createRequestTypes('REGISTER');
const LOGIN = createRequestTypes('LOGIN');
const USER = createRequestTypes('USER');

const action = (type, payload = {}) => {
  return { type, ...payload };
};

const register = {
  request: (username, password) => action(REGISTER.REQUEST, { username, password }),
  success: (login, response) => action(REGISTER.SUCCESS, { login, response }),
  failure: (login, error) => action(REGISTER.FAILURE, { login, error }),
};

const login = {
  request: (username, password) => action(LOGIN.REQUEST, { username, password }),
  success: token => action(LOGIN.SUCCESS, { token }),
  failure: (username, error) => action(LOGIN.FAILURE, { username, error }),
};

const NAVIGATE = 'NAVIGATE';
const navigate = pathname => action(NAVIGATE, { pathname });

const UI_UPDATE = 'UI_UPDATE';
const uiUpdate = uiUpdates => action(UI_UPDATE, { uiUpdates });

const ACCOUNT_NEW_TRANSACTIONS_INPUT_UPDATE = 'ACCOUNT_NEW_TRANSACTIONS_INPUT_UPDATE';
const accountNewTransactionsInputUpdate = newTransactions => action(ACCOUNT_NEW_TRANSACTIONS_INPUT_UPDATE, { newTransactions });

export default {
  USER,
  NAVIGATE,
  UI_UPDATE,
  uiUpdate,
  LOGIN,
  login,
  ACCOUNT_NEW_TRANSACTIONS_INPUT_UPDATE,
  accountNewTransactionsInputUpdate,
  navigate,
  register,
};
