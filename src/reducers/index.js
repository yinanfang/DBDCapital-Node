// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

// import _cloneDeep from 'lodash/cloneDeep';
// import _merge from 'lodash/merge';

import Actions from '../actions';
import { DEFAULT_STATE as DEFAULT_STATE_ACCOUNT_ADMIN } from '../containers/Account/Admin';
import { DEFAULT_STATE as DEFAULT_STATE_ACCOUNT_EDITOR_TRANSACTION } from '../containers/Account/EditorTransaction';

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

// TODO: Deprecated. Deleate after the transaction editor is done
const accountAdminTargetAccountReducer = (state = DEFAULT_STATE_ACCOUNT_ADMIN.targetAccount, action) => {
  if (action.type === Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.SUCCESS) {
    return action.accountInfo;
  } else if (action.type === Actions.ACCOUNT.ADMIN.NEW_TRANSACTIONS.UPDATE) {
    if (action.accountId) {
      // TODO: Move to Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.UPDATE or others ?
      return {
        _id: action.accountId,
      };
    }
  }
  return state;
};

// TODO: Move to Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.UPDATE or others ?
const accountAdminNewTransactionsReducer = (state = DEFAULT_STATE_ACCOUNT_ADMIN.newTransactions, action) => {
  if (action.type === Actions.ACCOUNT.ADMIN.NEW_TRANSACTIONS.UPDATE) {
    return Object.assign({}, state, action.newTransactions);
  }
  return state;
};

const accountAdminEditorTransactionStepReducer = (state = DEFAULT_STATE_ACCOUNT_EDITOR_TRANSACTION.step, action) => {
  if (action.type === Actions.ACCOUNT.ADMIN.EDITOR_TRANSACTION.STEP.INDEX.INCREMENT) {
    const maxIndex = state.maxCount;
    const currentIndex = state.index;
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : currentIndex;
    return Object.assign({}, state, {
      ...state,
      index: newIndex,
    });
  } else if (action.type === Actions.ACCOUNT.ADMIN.EDITOR_TRANSACTION.STEP.INDEX.DECREMENT) {
    const currentIndex = state.index;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    return Object.assign({}, state, {
      ...state,
      index: newIndex,
    });
  }
  return state;
};

const accountAdminEditorTransactionReducer = (state = DEFAULT_STATE_ACCOUNT_EDITOR_TRANSACTION, action) => {
  return {
    ...state,
    step: accountAdminEditorTransactionStepReducer(state.step, action),
  };
};

const accountAdminReducer = combineReducers({
  targetAccount: accountAdminTargetAccountReducer,
  newTransactions: accountAdminNewTransactionsReducer,
  editorTransaction: accountAdminEditorTransactionReducer,
});

const account = combineReducers({
  common: (state = {}, action) => state,
  overview: (state = {}, action) => state,
  admin: accountAdminReducer,
});

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
