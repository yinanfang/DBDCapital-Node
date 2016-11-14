// @flow

const mainWebAppWithAuth = [
  '^/account',
];

const mainWebAppWithNoAuth = [
  '^/$',
];

export default {
  Parse: {
    Server: '^/parse',
    Dashboard: '^/dashboard',
  },
  DBDCapital: {
    Routes: [
      ...mainWebAppWithAuth,
      ...mainWebAppWithNoAuth,
    ],
  },
  API: {
    noAuth: [
      'register',
      '/login',
    ],
    requireAuth: [
      '/user',
    ],
  },
};
