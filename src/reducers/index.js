// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import _cloneDeep from 'lodash/cloneDeep';

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


const initNewTransactions = () => {
  const result = {};
  for (let i = 0; i < AccountAdmin.DEFAULT_NEW_TRANSACTIONS_COUNT; i++) {
    result[i] = {
      [AccountAdmin.SELECT.key]: AccountAdmin.SELECT.value,
      [AccountAdmin.DROPDOWN_ACTION.key]: AccountAdmin.DROPDOWN_ACTION.BUY,
    };
  }
  return result;
};
const accountDefault = {
  admin: {
    newTransactions: initNewTransactions(),
  },
};
const account = (state = accountDefault, action) => {
  if (action.type === actions.ACCOUNT_NEW_TRANSACTIONS_INPUT_UPDATE) {
    return _cloneDeep({
      admin: {
        newTransactions: action.newTransactions,
      },
    });
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
