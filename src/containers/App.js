// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const App = (props) => {
  const a = 1;
  return (
    <div>
      {props.children}
    </div>
  );
};

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};

export default connect()(App);
