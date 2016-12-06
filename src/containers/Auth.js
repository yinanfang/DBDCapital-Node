// @flow

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import $ from 'jquery';

// import AppBar from 'material-ui/AppBar';
// import IconButton from 'material-ui/IconButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import styleCSS from '../style.css';
import styleJS from '../style.css.js';

// import image from '../images/OKAWARI.jpg';

const Auth = (props) => {
  const moveRight = (event) => {
    $(`.${styleCSS.authDialogueMask}`).animate({
      marginLeft: '50%',
    });
    $(`.${styleCSS.authDialogueContainer}`).animate({
      marginLeft: '-100%',
    });
  };

  const moveLeft = () => {
    $(`.${styleCSS.authDialogueMask}`).animate({
      marginLeft: 0,
    });
    $(`.${styleCSS.authDialogueContainer}`).animate({
      marginLeft: 0,
    });
  };

  const loginOnclick = () => {
    browserHistory.push('/');
  };

  return (
    <div className={styleCSS.authBase}>
      <div className={styleCSS.authDialogue}>
        <div className={styleCSS.authDialogueBackdrop}>
          <div className={styleCSS.authDialogueBackdropLeft} />
          <div className={styleCSS.authDialogueBackdropRight} />
        </div>
        <div className={styleCSS.authDialogueMask}>
          <div className={styleCSS.authDialogueContainer}>
            <div className={styleCSS.authDialogueContainerLeft}>
              <div className={styleCSS.authDialogueFormContainerLeft}>
                <h2>Sign Up</h2>
                <TextField floatingLabelText="First Name" floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} />
                <TextField floatingLabelText="Last Name" floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} /><br />
                <TextField floatingLabelText="Username" floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} /><br />
                <TextField floatingLabelText="Email" floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} /><br />
                <TextField floatingLabelText="Password" floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} type="password" /><br />
                <br />
                <FlatButton label="Sign Up" style={styleJS.authButtonMain} />
                <FlatButton onClick={moveRight} label="Log In" style={styleJS.authButtonSecondary} />
              </div>
            </div>
            <div className={styleCSS.authDialogueContainerRight}>
              <div className={styleCSS.authDialogueFormContainerRight}>
                <h2>Login</h2>
                <TextField floatingLabelText="Username" floatingLabelStyle={styleJS.authLabelDark} floatingLabelFocusStyle={styleJS.authLabelDark} underlineStyle={styleJS.authInputUnderlineDark} underlineFocusStyle={styleJS.authInputUnderlineDark} /><br />
                <TextField floatingLabelText="Password" floatingLabelStyle={styleJS.authLabelDark} floatingLabelFocusStyle={styleJS.authLabelDark} underlineStyle={styleJS.authInputUnderlineDark} underlineFocusStyle={styleJS.authInputUnderlineDark} type="password" /><br />
                <br />
                <FlatButton label="Log In" onClick={loginOnclick} style={styleJS.authButtonMain} />
                <FlatButton onClick={moveLeft} label="Sign Up" style={styleJS.authButtonSecondary} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(Auth);
