// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';

import Actions from '../actions';
import { DEFAULT_STATE as DEFAULT_STATE_ACCOUNT } from '../containers/Account';

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
const uiStore = (state = uiStoreDefault, action) => {
  if (action.type === Actions.UI_UPDATE) {
    return Object.assign({}, state, action.uiUpdates);
  }
  if (action.type === Actions.LOADING.UPDATE) {
    return Object.assign({}, state, { isLoading: action.state });
  }
  return state;
};

const account = (state = DEFAULT_STATE_ACCOUNT, action) => {
  if (action.type === Actions.ACCOUNT_NEW_TRANSACTIONS.UPDATE) {
    const copy = _cloneDeep(state);
    _merge(copy, {
      admin: {
        account: action.account,
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
