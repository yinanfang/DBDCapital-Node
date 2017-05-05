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
import CircularProgress from 'material-ui/CircularProgress';

import { DEFAULT_STATE as DEFAULT_STATE_ADMIN } from './Admin';

import Actions from '../../actions';
import styleCSS from '../../style.css';

const DEFAULT_STATE = {
  common: {
  },
  overview: {
  },
  admin: DEFAULT_STATE_ADMIN,
};

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
      props.accountOverviewInfoRequest();
    }
    updateDrawOpenState(false);
  };

  const DRAWER_WIDTH = 220;
  const sectionLoadingContainerStyle = () => {
    return props.isMobileDrawer ? {} : {
      marginLeft: DRAWER_WIDTH / 2,
    };
  };
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

  const loadingScreen = () => {
    if (props.isLoading) {
      return (
        <div className={styleCSS.accountSectionLoadingMask}>
          <div style={sectionLoadingContainerStyle()} className={styleCSS.accountSectionLoadingContainer}>
            <CircularProgress size={80} thickness={5} className={styleCSS.accountSectionLoadingProgress} />
            <h2>Loading...</h2>
          </div>
        </div>
      );
    }
    return '';
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

        { loadingScreen() }

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
  isLoading: PropTypes.bool.isRequired,
  uiUpdate: PropTypes.func.isRequired,
  accountOverviewInfoRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isMobileDrawer: state.uiStore.isMobileDrawer,
    isMobileViewer: state.uiStore.isMobileViewer,
    isDrawerOpen: state.uiStore.isDrawerOpen,
    isLoading: state.uiStore.isLoading,
    accountOverview: state.account.overview,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
  accountOverviewInfoRequest: Actions.account.overview.info.request,
})(Account);

export {
  DEFAULT_STATE,
};
