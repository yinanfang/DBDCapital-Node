// @flow

const boxShadow = {
  boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
};

const deepskyblue = 'rgb(3, 169, 244)';
const darkGray = 'rgb(155,155,155)';
const dimgray = 'rgb(90, 90, 90)';

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
  authButtonMain: {
    margin: '0 5px',
    color: 'white',
    backgroundColor: deepskyblue,
  },
  authButtonSecondary: {
    margin: '0 8px',
    color: deepskyblue,
  },
  authLabelDark: {
    color: darkGray,
    fontWeight: 300,
  },
  authInputUnderlineDark: {
    borderColor: darkGray,
  },
  authLabelLight: {
    color: dimgray,
    fontWeight: 300,
  },
  authInputUnderlineLight: {
    borderColor: dimgray,
  },
};
