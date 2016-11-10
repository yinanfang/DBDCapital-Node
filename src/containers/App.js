// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import styles from '../style.css';

const App = (props) => {
  return (
    <div>
      <Helmet
        defaultTitle="DBD Capital"
        titleTemplate="%s - DBD Capital"
      />
      <AppBar
        title={<span className={styles.pageTitle}>Title</span>}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={<FlatButton label="Save" />}
      />
      {props.children}
      
    </div>
  );
};

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};

export default connect()(withWidth()(App));
