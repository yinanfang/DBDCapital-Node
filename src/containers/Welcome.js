// @flow

import React from 'react';
import { connect } from 'react-redux';
import styles from '../style.css';
import image from '../images/OKAWARI.jpg';

const Welcome = (props) => {
  const a = 1;
  return (
    <div className={styles.app}>
      <h1>Welcome</h1>
      <img src={image} alt="placeholder" />
    </div>
  );
};

export default connect()(Welcome);
