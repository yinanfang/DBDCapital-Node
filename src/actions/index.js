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
  success: (login, response) => action(REGISTER.SUCCESS, { user, response }),
  failure: (login, error) => action(REGISTER.FAILURE, { user, error }),
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


export default {
  USER,
  LOGIN,
  NAVIGATE,
  UI_UPDATE,
  register,
  login,
  navigate,
  uiUpdate,
};
