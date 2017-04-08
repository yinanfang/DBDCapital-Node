// @flow

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import Account from './containers/Account';
import Auth from './containers/Auth';
import AccountOverview from './containers/AccountOverview';
import AccountDevelopment from './containers/AccountDevelopment';
import AccountTransactions from './containers/AccountTransactions';
import AccountAdmin from './containers/AccountAdmin';
import Error from './containers/Error';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/auth" component={Auth} />
    <Route path="/account" component={Account}>
      <IndexRoute component={AccountOverview} />
      <Route path="development" component={AccountDevelopment} />
      <Route path="transactions" component={AccountTransactions} />
      <Route path="admin" component={AccountAdmin} />
    </Route>
    {/* Need to be enabled from server.js */}
    <Route path="*" component={Error} />
  </Route>
);
