// @flow

const secure = (paths) => {
  return paths.map((item) => {
    return `^${item}$`;
  });
};

const webWithAuth = [
  '/account',
];

const webWithNoAuth = [
  '/',
  '/auth',
];

const webRoutesUnsecure = [
  ...webWithAuth,
  ...webWithNoAuth,
];

const APIWithAuth = [
  '^/user$',
];

const APIWithNoAuth = [
  '^/register$',
  '^/login$',
];

export default {
  Parse: {
    Server: '^/parse',
    Dashboard: '/dashboard', // New parse-dashboard won't accept ^
  },
  DBDCapital: {
    Routes: secure(webRoutesUnsecure),
    RoutesUnsecure: webRoutesUnsecure,
  },
  API: {
    requireAuth: APIWithAuth,
    noAuth: APIWithNoAuth,
    Routes: [
      ...APIWithAuth,
      ...APIWithNoAuth,
    ],
  },
};
