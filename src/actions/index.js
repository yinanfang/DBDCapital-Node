// @flow

// Reference 01: https://github.com/yelouafi/redux-saga/blob/master/examples/real-world/actions/index.js
// Reference 02: https://engineering.haus.com/so-youve-screwed-up-your-redux-store-or-why-redux-makes-refactoring-easy-400e19606c71#4fed

const UPDATE = 'UPDATE';
const REQUEST = 'REQUEST';
const SUBMIT = 'SUBMIT';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createRequestTypes = (base) => {
  return [UPDATE, REQUEST, SUBMIT, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
};
const action = (type, payload = {}) => {
  return { type, ...payload };
};

const LOGIN = createRequestTypes('LOGIN');
const login = {
  request: (username, password) => action(LOGIN.REQUEST, { username, password }),
  success: token => action(LOGIN.SUCCESS, { token }),
  failure: (username, error) => action(LOGIN.FAILURE, { username, error }),
};

const REGISTER = createRequestTypes('REGISTER');
const register = {
  request: (username, password) => action(REGISTER.REQUEST, { username, password }),
  success: (login, response) => action(REGISTER.SUCCESS, { login, response }),
  failure: (login, error) => action(REGISTER.FAILURE, { login, error }),
};

const ACCOUNT_NEW_TRANSACTIONS = createRequestTypes('USER');
const accountNewTransactions = {
  update: newTransactions => action(ACCOUNT_NEW_TRANSACTIONS.UPDATE, { newTransactions }),
  submit: (newTransactions, authToken) => action(ACCOUNT_NEW_TRANSACTIONS.SUBMIT, { newTransactions, authToken }),
};

const USER = createRequestTypes('USER');

const NAVIGATE = 'NAVIGATE';
const navigate = pathname => action(NAVIGATE, { pathname });

const UI_UPDATE = 'UI_UPDATE';
const uiUpdate = uiUpdates => action(UI_UPDATE, { uiUpdates });

export default {
  USER,
  NAVIGATE,
  UI_UPDATE,
  uiUpdate,
  LOGIN,
  login,
  ACCOUNT_NEW_TRANSACTIONS,
  accountNewTransactions,
  navigate,
  register,
};
