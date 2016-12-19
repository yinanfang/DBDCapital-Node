// @flow

const parseAuthHeader = (authHeader) => {
  const elements = authHeader.split(' ');
  if (elements.length === 2) {
    const scheme = elements[0];
    if (scheme === 'Bearer') {
      return elements[1];
    }
  }
  return '';
};

const getJWTFromHttpObject = (httpObject) => {
  const authHeader = httpObject.headers.authorization;
  if (authHeader) {
    return parseAuthHeader(authHeader);
  }
  return '';
};

export default {
  parseAuthHeader,
  getJWTFromHttpObject,
};
