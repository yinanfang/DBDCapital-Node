// @flow

import React from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

import styles from '../style.css';

const Account = (props) => {
  const a = 1;
  return (
    <div>
      <Helmet title="Account" />
      <AppBar
        title={<span className={styles.pageTitle}>Account</span>}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={<FlatButton label="Save" />}
      />
    </div>
  );
};

export default connect()(Account);
