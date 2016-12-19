import 'isomorphic-fetch';

import Path from '../../path';
import Util from '../../utils';

const login = (username, password) => {
  console.log(`src/api.js-------> ${Path.API.basePath}/login`);
  return fetch(`${Path.API.basePath}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  .then((response) => {
    const token = Util.parseAuthHeader(response.headers.get('authorization'));
    console.log('++++', token);
    return token;
  })
  .catch((ex) => {
    console.log('parsing failed', ex);
    return null;
  });
};

export default {
  login,
};
