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

const NAVIGATE = 'NAVIGATE';
const navigate = (pathname: string) => action(NAVIGATE, { pathname });

const UI_UPDATE = 'UI_UPDATE';
const uiUpdate = (uiUpdates: {}) => action(UI_UPDATE, { uiUpdates });

const LOADING = createRequestTypes('LOADING');
const loading = {
  update: (state: boolean) => action(LOADING.UPDATE, { state }),
};

const USER = createRequestTypes('USER');

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

const ACCOUNT = {
  INFO: createRequestTypes('ACCOUNT_INFO'),
  ADD: createRequestTypes('ACCOUNT_ADD'),
  OVERVIEW: {
    INFO: createRequestTypes('ACCOUNT_OVERVIEW'),
  },
  ADMIN: {
    TARGET_ACCOUNT: createRequestTypes('ACCOUNT_ADMIN_TARGET_ACCOUNT'),
    NEW_TRANSACTIONS: createRequestTypes('ACCOUNT_ADMIN_NEW_TRANSACTIONS'),
  },
};
const account = {
  create: {
    request: (page: string, name: string, scope: {}) => action(ACCOUNT.ADD.REQUEST, { page, name, scope }),
    success: (payload: {}) => action(ACCOUNT.ADD.SUCCESS, { payload }),
  },
  info: {
    request: (page: string, accountId: string, scope: {}) => action(ACCOUNT.INFO.REQUEST, { page, accountId, scope }),
    success: (payload: {}) => action(ACCOUNT.INFO.SUCCESS, { payload }),
  },
  overview: {
    info: {
      request: () => action(ACCOUNT.INFO.OVERVIEW.REQUEST, { }),
      success: (payload: {}) => action(ACCOUNT.OVERVIEW.INFO.SUCCESS, { payload }),
    },
  },
  admin: {
    targetAccount: {
      request: (accountId: string) => action(ACCOUNT.ADMIN.TARGET_ACCOUNT.REQUEST, { accountId }),
      success: (accountInfo: {}) => action(ACCOUNT.ADMIN.TARGET_ACCOUNT.SUCCESS, { accountInfo }),
    },
    newTransactions: {
      update: (newTransactions: {}, accountId: string) => action(ACCOUNT.ADMIN.NEW_TRANSACTIONS.UPDATE, { newTransactions, accountId }),
      submit: (newTransactions: {}, accountId: string) => action(ACCOUNT.ADMIN.NEW_TRANSACTIONS.SUBMIT, { newTransactions, accountId }),
    },
  },
};

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
  ACCOUNT,
  account,
};
