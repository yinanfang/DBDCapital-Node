// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';

import actions from '../actions';
import AccountAdmin from '../containers/AccountAdmin';

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

const accountDefault = {
  admin: {
    newTransactions: AccountAdmin.DEFAULT_NEW_TRANSACTIONS,
  },
};
const account = (state = accountDefault, action) => {
  if (action.type === actions.ACCOUNT_NEW_TRANSACTIONS.UPDATE) {
    const copy = _cloneDeep(state);
    _merge(copy, {
      admin: {
        newTransactions: action.newTransactions,
      },
    });
    return copy;
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
  account,
  entities,
  routing, // https://github.com/reactjs/react-router-redux
});

export default rootReducer;
