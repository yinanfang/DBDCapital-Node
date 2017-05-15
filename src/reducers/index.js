// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import Actions from '../actions';
import type { GCActionType } from '../actions';
import AccountReducer from './Account';

const auth = (state = {}, action) => {
  if (action.type === Actions.LOGIN.SUCCESS) {
    return { token: action.token };
  }
  return state;
};

const uiStoreDefault = {
  isMobileViewer: false,
  isMobileDrawer: false,
  isDrawerOpen: false,
  isLoading: false,
  measure: {},
};
const uiStore = (state = uiStoreDefault, action: GCActionType) => {
  if (action.type === Actions.UI_UPDATE) {
    return Object.assign({}, state, action.uiUpdates);
  }
  if (action.type === Actions.LOADING.UPDATE) {
    return Object.assign({}, state, { isLoading: action.state });
  }
  return state;
};

const entities = (state = 0, action: GCActionType) => {
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
  account: AccountReducer,
  entities,
  routing, // https://github.com/reactjs/react-router-redux
});

export default rootReducer;
