import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Welcome from './containers/Welcome';
import Home from './containers/Home';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Welcome} />
    <Route path="/home" component={Home} />
    {/* <Route path="/:login" component={UserPage} /> */}
  </Route>
);
