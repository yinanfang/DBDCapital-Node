// pm2 workaround: babeljs require hook
// https://github.com/Unitech/pm2/issues/1643#issuecomment-144087967

require('babel-register');
require('./server.js');
