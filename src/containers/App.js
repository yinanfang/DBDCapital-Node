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
    const isMobileDrawer = measure.width < MOBILE_DRAWER_INCEPTION;
    if (isMobileDrawer !== props.measure.isMobileDrawer) {
      measure.isMobileDrawer = isMobileDrawer;
      hasCriticalUpdate = true;
    }

    const isMobileViewer = measure.width < MOBILE_VIEWER_INCEPTION;
    if (isMobileViewer !== props.measure.isMobileViewer) {
      measure.isMobileViewer = isMobileViewer;
      hasCriticalUpdate = true;
    }

    if (hasCriticalUpdate) {
      console.log('filre!!!');
      props.measureUpdate(measure);
    }
  };

  return (
    <div className={styleCSS.appBase}>
      <Helmet
        defaultTitle="DBD Capital"
        titleTemplate="%s - DBD Capital"
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
  measureUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    measure: state.measure,
  };
};

export default connect(mapStateToProps, {
  measureUpdate: Actions.measureUpdate,
})(App);
