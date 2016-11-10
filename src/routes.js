import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Account from './containers/Account';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/account" component={Account} />
    {/* <Route path="/:login" component={UserPage} /> */}
  </Route>
);
