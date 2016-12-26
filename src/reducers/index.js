// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import actions from '../actions';

const auth = (state = {}, action) => {
  if (action.type === actions.LOGIN.SUCCESS) {
    return { token: action.token };
  }
  return state;
};

const measure = (state = { isMobileDrawer: false, isMobileViewer: false }, action) => {
  if (action.type === actions.MEASURE_UPDATE) {
    return Object.assign(state, action.dimensions);
  }
  return state;
};

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
  auth,
  measure,
  entities,
  routing, // https://github.com/reactjs/react-router-redux
});

export default rootReducer;
