// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Radium from 'radium';

import Helmet from 'react-helmet';
import loremipsum from 'lorem-ipsum';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import styleCSS from '../style.css';
import styleJS from '../style.css.js';

const Home = (props) => {
  return (
    <MuiThemeProvider>
      <div>
        <Helmet title="Home" />
        <div className={styleCSS.homeMainSection}>
          <AppBar
            title={<span><h1 className={styleCSS.pageTitle}>DBD Capital</h1></span>}
            iconElementLeft={<ActionHome style={styleJS.forceHide} />}
            iconElementRight={<Link to="/auth"><FlatButton label="Sign In" type="text/html" hoverColor={styleJS.homeSignUpBox.hoverColor} backgroundColor={styleJS.homeSignUpBox.backgroundColor} style={styleJS.boxShadow} /></Link>}
            style={styleJS.homeNavBar}
            className={styleCSS.homeNavBar}
          />
          <video loop muted autoPlay className={styleCSS.homeVideo} preload="auto" poster="https://www.mapbox.com/home/video/header.jpg">
            <source src="https://www.mapbox.com/home/video/header.mp4" type="video/mp4" width="100%" height="100%" />
          </video>
        </div>
        <div className={styleCSS.showcase}>
          <h2>
            Best financial solution
          </h2>
        </div>
        <div className={styleCSS.footer}>
          <p>DBD Capial @ 2017</p>
        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default connect()(Radium(Home, styleJS));
