// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan500, red50 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
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

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Helmet title="Account" />
        <AppBar
          onLeftIconButtonTouchTap={handleLeftIconButtonTouchTap}
          title={<span className={styleCSS.pageTitle}>Account</span>}
          iconElementRight={<FlatButton label="Save" />}
        />
        <Drawer
          width={256}
          docked={!props.isMobileDrawer}
          open={!props.isMobileDrawer || props.isDrawerOpen}
          onRequestChange={updateDrawOpenState}
        >
          <div className={styleCSS.accountLogo}>
            DBD Capital
          </div>
          <List>
            <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
            <ListItem primaryText="Starred" leftIcon={<ActionGrade />} />
            <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
            <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
            <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
          </List>
        </Drawer>
      </div>
    </MuiThemeProvider>
  );
};

Account.propTypes = {
  // Injected by React Router
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
})(Account);
