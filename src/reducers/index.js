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

const uiStoreDefault = {
  isMobileViewer: false,
  isMobileDrawer: false,
  isDrawerOpen: false,
  measure: {},
};
const uiStore = (state = uiStoreDefault, action) => {
  if (action.type === actions.UI_UPDATE) {
    return Object.assign({}, state, action.uiUpdates);
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
  uiStore,
  entities,
  routing, // https://github.com/reactjs/react-router-redux
});

export default rootReducer;
