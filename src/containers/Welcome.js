// @flow

import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';

import styles from '../style.css';

import image from '../images/OKAWARI.jpg';

const Welcome = (props) => {
  const a = 1;
  return (
    <div className={styles.app}>
      <AppBar
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <h1>Welcome</h1>
      <img src={image} alt="placeholder" />
    </div>
  );
};

export default connect()(Welcome);
