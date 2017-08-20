// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import Actions from '../../actions';
// import styleCSS from '../style.css';

const AccountDevelopment = (props) => {
  return (
    <div>
      <Helmet title="Account" />
      <div>Charts</div>
      <div>Portfolio Value</div>
      <div>Weekly Variation</div>
      <div>Total Variation</div>
    </div>
  );
};

AccountDevelopment.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  isMobileDrawer: PropTypes.bool.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  uiUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isMobileDrawer: state.uiStore.isMobileDrawer,
    isDrawerOpen: state.uiStore.isDrawerOpen,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
})(AccountDevelopment);
