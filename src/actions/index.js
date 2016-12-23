// @flow

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
const NAVIGATE = 'NAVIGATE';

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

const navigate = pathname => action(NAVIGATE, { pathname })


export default {
  USER,
  LOGIN,
  NAVIGATE,
  register,
  login,
  navigate,
};
