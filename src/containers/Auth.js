// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Actions from '../actions';
import styleCSS from '../style.css';
import styleJS from '../style.css.js';

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

  const LIGHT = 'light';
  const DARK = 'dark';
  const textField = (theme, content, type = 'text') => {
    if (theme === LIGHT) {
      return <TextField fullWidth name={content.name} floatingLabelText={content.text} floatingLabelStyle={styleJS.authLabelLight} floatingLabelFocusStyle={styleJS.authLabelLight} underlineStyle={styleJS.authInputUnderlineLight} underlineFocusStyle={styleJS.authInputUnderlineLight} type={type} />;
    }
    return <TextField fullWidth name={content.name} floatingLabelText={content.text} floatingLabelStyle={styleJS.authLabelDark} floatingLabelFocusStyle={styleJS.authLabelDark} underlineStyle={styleJS.authInputUnderlineDark} underlineFocusStyle={styleJS.authInputUnderlineDark} type={type} />;
  };

  const registerOnclick = () => {
    event.preventDefault();
  };

  const formPair = (name, text) => ({ name, text });
  const form = {
    register: {
      key: 'register',
      firstname: formPair('fistname', 'Fist Name'),
      lastname: formPair('lastname', 'Last Name'),
      email: formPair('email', 'Email'),
      username: formPair('username', 'Username'),
      password: formPair('password', 'Password'),
    },
    login: {
      key: 'login',
      username: formPair('username', 'Username'),
      password: formPair('password', 'Password'),
    },
  };

  const loginOnclick = (event) => {
    event.preventDefault();
    props.login(
      $(`form[name="${form.login.key}"] input[name="${form.login.username.name}"]`).val(),
      $(`form[name="${form.login.key}"] input[name="${form.login.password.name}"]`).val(),
    );
  };

  return (
    <MuiThemeProvider>
      <div>
        <Helmet title="Auth" />
        <div className={styleCSS.authBase}>
          <div className={styleCSS.authDialogue}>
            <div className={styleCSS.authDialogueBackdrop}>
              <div className={styleCSS.authDialogueBackdropLeft} />
              <div className={styleCSS.authDialogueBackdropRight} />
            </div>
            <div className={styleCSS.authDialogueMask}>
              <div className={styleCSS.authDialogueContainer}>
                <div className={styleCSS.authDialogueContainerLeft}>
                  <form name={form.register.key} className={styleCSS.authDialogueFormContainerLeft}>
                    <h2>Sign Up</h2>
                    {textField(LIGHT, form.register.firstname)}
                    {textField(LIGHT, form.register.lastname)}
                    {textField(LIGHT, form.register.email)}
                    {textField(LIGHT, form.register.username)}
                    {textField(LIGHT, form.register.password, 'password')}
                    <br />
                    <FlatButton label="Sign Up" onClick={registerOnclick} type="submit" style={styleJS.authButtonMain} />
                    <FlatButton onClick={moveRight} label="Log In" style={styleJS.authButtonSecondary} />
                  </form>
                </div>
                <div className={styleCSS.authDialogueContainerRight}>
                  <form name={form.login.key} className={styleCSS.authDialogueFormContainerRight}>
                    <h2>Login</h2>
                    {textField(DARK, form.login.username)}
                    {textField(DARK, form.login.password, 'password')}
                    <br />
                    <FlatButton label="Log In" onClick={loginOnclick} type="submit" style={styleJS.authButtonMain} />
                    <FlatButton onClick={moveLeft} label="Sign Up" style={styleJS.authButtonSecondary} />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
  );
};

Auth.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  login: Actions.login.request,
})(Auth);
