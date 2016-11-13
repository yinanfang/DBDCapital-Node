// @flow

import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import Helmet from 'react-helmet';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import ActionHome from 'material-ui/svg-icons/action/home'

import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import styleCSS from '../style.css';
import styleJS from '../style.css.js';

const Home = (props) => {
  return (
    <div>
      <div className={styleCSS.homeMainSection}>
        <Helmet title="Home" />
        <AppBar
          title={<span className={styleCSS.pageTitle}>DBD Capital</span>}
          // iconElementLeft={<ActionHome className={styleCSS.forceHide} />}
          iconElementLeft={<ActionHome style={styleJS.forceHide} />}
          iconElementRight={<FlatButton label="Sign In" hoverColor={styleJS.homeSignUpBox.hoverColor} backgroundColor={styleJS.homeSignUpBox.backgroundColor} style={styleJS.boxShadow} />}
          style={styleJS.homeNavBar}
          className={styleCSS.homeNavBar}
        />
        <video loop muted autoPlay="autoplay" className={styleCSS.homeVideo} preload="auto" poster="https://www.mapbox.com/home/video/header.jpg">
          <source src="https://www.mapbox.com/home/video/header.mp4" type="video/mp4" width="100%" height="100%" />
        </video>
      </div>
      <div className={styleCSS.homeSecondarySection}>
        <p>Second div</p>
      </div>
    </div>
  );
};

export default connect()(Radium(Home, styleJS));
