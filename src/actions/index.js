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

const LOADING = createRequestTypes('LOADING');
const loading = {
  update: (state: boolean) => action(LOADING.UPDATE, { state }),
};

const LOGIN = createRequestTypes('LOGIN');
const login = {
  request: (username: string, password: string) => action(LOGIN.REQUEST, { username, password }),
  success: (token: string) => action(LOGIN.SUCCESS, { token }),
  failure: (username: string, error: Error) => action(LOGIN.FAILURE, { username, error }),
};

const REGISTER = createRequestTypes('REGISTER');
const register = {
  request: (username: string, password: string) => action(REGISTER.REQUEST, { username, password }),
  success: (userInfo: {}, response: {}) => action(REGISTER.SUCCESS, { userInfo, response }),
  failure: (userInfo: {}, error: Error) => action(REGISTER.FAILURE, { userInfo, error }),
};

const ACCOUNT_INFO = createRequestTypes('ACCOUNT_INFO');
const accountInfo = {
  request: (page: string, account: string, scope: {}) => action(ACCOUNT_INFO.REQUEST, { page, account, scope }),
  success: (payload: {}) => action(ACCOUNT_INFO.SUCCESS, { payload }),
};

const ACCOUNT_OVERVIEW = createRequestTypes('ACCOUNT_OVERVIEW');
const accountOverview = {
  request: () => action(ACCOUNT_OVERVIEW.REQUEST, { }),
  success: (payload: {}) => action(ACCOUNT_OVERVIEW.SUCCESS, { payload }),
};

const ACCOUNT_NEW_TRANSACTIONS = createRequestTypes('ACCOUNT_NEW_TRANSACTIONS');
const accountNewTransactions = {
  update: (newTransactions: {}, account: string) => action(ACCOUNT_NEW_TRANSACTIONS.UPDATE, { newTransactions, account }),
  submit: (newTransactions: {}, account: string) => action(ACCOUNT_NEW_TRANSACTIONS.SUBMIT, { newTransactions, account }),
};

const USER = createRequestTypes('USER');

const NAVIGATE = 'NAVIGATE';
const navigate = (pathname: string) => action(NAVIGATE, { pathname });

const UI_UPDATE = 'UI_UPDATE';
const uiUpdate = (uiUpdates: {}) => action(UI_UPDATE, { uiUpdates });

export default {
  NAVIGATE,
  LOADING,
  loading,
  navigate,
  UI_UPDATE,
  uiUpdate,
  REGISTER,
  register,
  USER,
  LOGIN,
  login,
  ACCOUNT_INFO,
  accountInfo,
  ACCOUNT_OVERVIEW,
  accountOverview,
  ACCOUNT_NEW_TRANSACTIONS,
  accountNewTransactions,

};
