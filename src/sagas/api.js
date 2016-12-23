import 'isomorphic-fetch';

import Path from '../../path';

// https://github.com/github/fetch#caveats
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const parseJSON = (response) => {
  return response.json();
};

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
  .then(checkStatus)
  .then(parseJSON)
  .then((data) => {
    return data.token;
  })
  .catch((ex) => {
    console.log('parsing failed', ex);
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

export default {
  login,
};
