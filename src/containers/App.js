// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import styleCSS from '../style.css';

const App = (props) => {
  return (
    <div className={styleCSS.appBase}>
      <Helmet
        defaultTitle="DBD Capital"
        titleTemplate="%s - DBD Capital"
      />
      {props.children}
    </div>
  );
};

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};

export default connect()(App);
