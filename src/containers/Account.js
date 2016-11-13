// @flow

import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import styles from '../style.css';

import image from '../images/OKAWARI.jpg';

const Account = (props) => {
  const a = 1;
  return (
    <div>
      <AppBar
        title={<span className={styles.pageTitle}>Account</span>}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={<FlatButton label="Save" />}
      />
      <img src={image} alt="placeholder" />
    </div>
  );
};

export default connect()(withWidth()(Account));
