// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import $ from 'jquery';

import Helmet from 'react-helmet';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan500 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Home from 'material-ui/svg-icons/action/home';
import Timeline from 'material-ui/svg-icons/action/timeline';
import Receipt from 'material-ui/svg-icons/action/receipt';
import VerifiedUser from 'material-ui/svg-icons/action/verified-user';
import FlatButton from 'material-ui/FlatButton';

import Actions from '../actions';
import styleCSS from '../style.css';

const Account = (props) => {
  const muiTheme = getMuiTheme({
    palette: {
      // textColor: cyan500,
    },
    appBar: {
      textColor: cyan500,
      color: 'white',
    },
  });

  const updateDrawOpenState = (isOpen) => {
    props.uiUpdate({ isDrawerOpen: isOpen });
  };
  const handleLeftIconButtonTouchTap = () => {
    updateDrawOpenState(!props.isDrawerOpen);
  };
  const navTabOnClick = (event) => {
    if ($(event.target).closest('a').attr('href') === '/account') {
      props.accountOverviewRequest();
    }
    updateDrawOpenState(false);
  };

  const DRAWER_WIDTH = 220;
  const sectionContainerStyle = () => {
    return props.isMobileDrawer ? {} : {
      marginLeft: DRAWER_WIDTH,
    };
  };
  const sectionViewerStyle = () => {
    return props.isMobileViewer ? {
      margin: '24px',
    } : {
      margin: '35px 40px',
    };
  };

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div className={styleCSS.accountBase}>
        <Helmet title="Account" />
        <AppBar
          onLeftIconButtonTouchTap={handleLeftIconButtonTouchTap}
          title={<span className={styleCSS.pageTitle}>Account</span>}
          iconElementRight={<FlatButton label="Log Out" />}
        />
        <Drawer
          width={DRAWER_WIDTH}
          docked={!props.isMobileDrawer}
          open={!props.isMobileDrawer || props.isDrawerOpen}
          onRequestChange={updateDrawOpenState}
        >
          <div className={styleCSS.accountLogo}>
            DBD Capital
          </div>
          <List>
            <Link to="/account" onClick={navTabOnClick}><ListItem primaryText="Overview" leftIcon={<Home />} /></Link>
            <Link to="/account/development" onClick={navTabOnClick}><ListItem primaryText="Development" leftIcon={<Timeline />} /></Link>
            <Link to="/account/transactions" onClick={navTabOnClick}><ListItem primaryText="Transactions" leftIcon={<Receipt />} /></Link>
            <Link to="/account/admin" onClick={navTabOnClick}><ListItem primaryText="Admin" leftIcon={<VerifiedUser />} /></Link>
          </List>
        </Drawer>
        <div style={sectionContainerStyle()}>
          <div style={sectionViewerStyle()}>
            {props.children}
          </div>
        </div>
      </div>
    </MuiThemeProvider>
  );
};

Account.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  isMobileDrawer: PropTypes.bool.isRequired,
  isMobileViewer: PropTypes.bool.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  uiUpdate: PropTypes.func.isRequired,
  accountOverviewRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isMobileDrawer: state.uiStore.isMobileDrawer,
    isMobileViewer: state.uiStore.isMobileViewer,
    isDrawerOpen: state.uiStore.isDrawerOpen,
    accountOverview: state.account.overview,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
  accountOverviewRequest: Actions.accountOverview.request,
})(Account);
