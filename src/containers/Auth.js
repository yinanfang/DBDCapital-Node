// @flow

import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

import styleCSS from '../style.css';
import styleJS from '../style.css.js';

import image from '../images/OKAWARI.jpg';

const Auth = (props) => {
  const a = 1;
  return (
    <div className={styleCSS.authBase}>
      <div className={styleCSS.authDialogue}>
        <div className={styleCSS.authDialogueBackdrop}>
          <div className={styleCSS.authDialogueBackdropLeft}>
            {/* <img src={image} alt="placeholder" /> */}
          </div>
          <div className={styleCSS.authDialogueBackdropRight}>
            {/* <img src={image} alt="placeholder" /> */}
          </div>
        </div>
        <div>
          test
        </div>
      </div>
    </div>
  );
};

export default connect()(Auth);
