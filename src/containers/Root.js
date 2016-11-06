import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from '../routes';

const Root = (props) => {
  const { store, history } = props;
  return (
    <Provider store={store}>
      <div>
        <Router history={history} routes={routes} />
      </div>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
