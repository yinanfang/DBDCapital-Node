import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Account from './containers/Account';
import Auth from './containers/Auth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/auth" component={Auth} />
    <Route path="/account" component={Account} />
  </Route>
);
