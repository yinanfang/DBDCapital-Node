// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

const entities = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  entities,
  routing, // https://github.com/reactjs/react-router-redux
});

export default rootReducer;
