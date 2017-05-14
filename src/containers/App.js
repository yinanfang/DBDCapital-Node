// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// Vendor CSS files
import 'sweetalert/dist/sweetalert.css';
import 'normalize.css';

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
    const isMobileDrawer = measure.width <= MOBILE_DRAWER_INCEPTION;
    if (isMobileDrawer !== props.uiStore.isMobileDrawer) {
      uiUpdates.isMobileDrawer = isMobileDrawer;
      hasCriticalUpdate = true;
    }

    const isMobileViewer = measure.width <= MOBILE_VIEWER_INCEPTION;
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
    <Measure
      onMeasure={(measure) => {
        handleMeasureUpdate(measure);
      }}
    >
      <div className={styleCSS.appBase}>
        <Helmet
          defaultTitle="DBD Capital"
          titleTemplate="%s - DBD Capital"
        />
        {props.children}
      </div>
    </Measure>
  );
};

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node.isRequired,
  // Injected by React Redux
  uiUpdate: PropTypes.func.isRequired,
  uiStore: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => {
  return {
    uiStore: state.uiStore,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
})(App);
