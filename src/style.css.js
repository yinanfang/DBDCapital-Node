// @flow

import Color from 'color';

const whiteTransparent = Color().rgb(255, 255, 255).alpha(0.5);

const boxShadow = {
  boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
};

export default {
  base: {
    // background: '#0074D9',
  },
  homeNavBar: {
    background: 'transparent',
    boxShadow: 'none',
    width: '86%',
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: '10px',
    marginBottom: '10px',
  },
  noVisibility: {
    visibility: 'hidden',
  },
  forceHide: {
    display: 'none',
  },
  boxShadow,
  homeSignUpBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    hoverColor: 'rgba(255,255,255,0.25)',
  },
};
