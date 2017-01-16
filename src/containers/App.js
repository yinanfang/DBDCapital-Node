// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import Measure from 'react-measure';

import Actions from '../actions';
import styleCSS from '../style.css';

const MOBILE_DRAWER_INCEPTION = 960;
const MOBILE_VIEWER_INCEPTION = 600;

const App = (props) => {
  const handleMeasureUpdate = (measure) => {
    let hasCriticalUpdate = false;
    const uiUpdates = {};
    const isMobileDrawer = measure.width < MOBILE_DRAWER_INCEPTION;
    if (isMobileDrawer !== props.uiStore.isMobileDrawer) {
      uiUpdates.isMobileDrawer = isMobileDrawer;
      hasCriticalUpdate = true;
    }

    const isMobileViewer = measure.width < MOBILE_VIEWER_INCEPTION;
    if (isMobileViewer !== props.uiStore.isMobileViewer) {
      uiUpdates.isMobileViewer = isMobileViewer;
      hasCriticalUpdate = true;
    }
    if (hasCriticalUpdate) {
      uiUpdates.measure = measure;
      props.uiUpdate(uiUpdates);
    }
  };

  return (
    <div className={styleCSS.appBase}>
      <Helmet
        defaultTitle="DBD Capital"
        titleTemplate="%s - DBD Capital"
        link={[
          { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css' },
        ]}
      />
      <Measure
        onMeasure={(measure) => {
          handleMeasureUpdate(measure);
        }}
      >
        {props.children}
      </Measure>
    </div>
  );
};

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  uiUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uiStore: state.uiStore,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
})(App);
