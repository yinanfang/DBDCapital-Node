// @flow weak

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'foo',
    };
  }
  render() {
    return (
      <div className="app_top">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
};

export default connect()(App);
