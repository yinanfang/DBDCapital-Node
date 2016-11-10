// @flow

import React from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import styles from '../style.css';

import image from '../images/OKAWARI.jpg';

const Home = (props) => {
  const a = 1;
  return (
    <div className={styles.app}>
      <Helmet title="Home" />
      <h1>Welcome</h1>
      <img src={image} alt="placeholder" />
    </div>
  );
};

export default connect()(Home);
