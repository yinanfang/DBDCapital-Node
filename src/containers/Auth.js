// @flow

import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

// import AppBar from 'material-ui/AppBar';
// import IconButton from 'material-ui/IconButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import styleCSS from '../style.css';
// import styleJS from '../style.css.js';

// import image from '../images/OKAWARI.jpg';

const Auth = (props) => {
  const moveRight = (event) => {
    $(`.${styleCSS.authTextboxMask}`).animate({
      marginLeft: '50%',
    });
    $(`.${styleCSS.authTextboxContainer}`).animate({
      marginLeft: '-100%',
    });
  };

  const moveLeft = () => {
    $(`.${styleCSS.authTextboxMask}`).animate({
      marginLeft: 0,
    });
    $(`.${styleCSS.authTextboxContainer}`).animate({
      marginLeft: 0,
    });
  };

  return (
    <div className={styleCSS.authBase}>
      <div className={styleCSS.authDialogue}>
        <div className={styleCSS.authDialogueBackdrop}>
          <div className={styleCSS.authDialogueBackdropLeft} />
          <div className={styleCSS.authDialogueBackdropRight} />
        </div>
        <div className={styleCSS.authTextboxMask}>
          <div className={styleCSS.authTextboxContainer}>
            <div className={styleCSS.authTextboxLeft}>
              <br /><br /><br /><br />
              <h2>Sign Up</h2>
              <TextField floatingLabelText="Username" /><br />
              <TextField floatingLabelText="Password" type="password" /><br />
              <FlatButton onClick={moveRight} label="Sign Up" />
            </div>
            <div className={styleCSS.authTextboxRight}>
              <br /><br /><br /><br />
              <h2>Login</h2>
              <TextField floatingLabelText="First Name" />
              <TextField floatingLabelText="Last Name" /><br />
              <TextField floatingLabelText="Username" /><br />
              <TextField floatingLabelText="Email" /><br />
              <TextField floatingLabelText="Password" type="password" /><br />

              <FlatButton onClick={moveLeft} label="Login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(Auth);
