import 'isomorphic-fetch';

import Path from '../../path';

const login = () => {
  console.log(`src/api.js-------> ${Path.API.basePath}/login`);
  fetch(`${Path.API.basePath}/login`, {
    method: 'GET',
  }).then((response) => {
    console.log('++++', response);
  })
  .then(() => {
    console.log('finished!');
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  });
};

export default {
  login,
};
