// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import Actions from '../../actions';
// import styleCSS from '../../style.css';

const AccountTransactions = (props) => {
  return (
    <div>
      <Helmet title="Account" />
      AccountTransactions
    </div>
  );
};

AccountTransactions.propTypes = {
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
})(AccountTransactions);
