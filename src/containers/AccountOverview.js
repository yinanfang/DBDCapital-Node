// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import Actions from '../actions';
// import styleCSS from '../style.css';

const AccountOverview = (props) => {
  return (
    <div>
      <Helmet title="Account" />
      <div>Portfolio Value</div>
      <div>Portfolio Value Chart</div>
      <div>Cach</div>
      <div>Security</div>
      <div>Plan</div>
    </div>
  );
};

AccountOverview.propTypes = {
  // Injected by React Redux
  accountOverview: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    accountOverview: state.account.overview,
  };
};

export default connect(mapStateToProps, {
})(AccountOverview);
