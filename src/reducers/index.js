// @flow

import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import _cloneDeep from 'lodash/cloneDeep';
import _merge from 'lodash/merge';

import Actions from '../actions';
import { DEFAULT_STATE as DEFAULT_STATE_ACCOUNT_ADMIN } from '../containers/Account/Admin';

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

const accountAdminReducer = (state = DEFAULT_STATE_ACCOUNT_ADMIN, action) => {
  // TODO: Deprecated. Deleate after the transaction editor is done
  if (action.type === Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.SUCCESS) {
    return {
      ...state,
      targetAccount: action.accountInfo,
    };
  } else if (action.type === Actions.ACCOUNT.ADMIN.NEW_TRANSACTIONS.UPDATE) {
    if (action.accountId) {
      // TODO: Move to Actions.ACCOUNT.ADMIN.TARGET_ACCOUNT.UPDATE or others ?
      return {
        ...state,
        targetAccount: {
          _id: action.accountId,
        },
      };
    }
    const copy = _cloneDeep(state);
    _merge(copy, {
      newTransactions: action.newTransactions,
    });
    // Update fee value if possible
    const updatedRows = Object.keys(action.newTransactions);
    updatedRows.forEach((row) => {
      const rowData = copy.newTransactions[row];
      const price: number = parseInt(rowData.price.value, 10);
      const quantity: number = parseInt(rowData.quantity.value, 10);
      if (price && quantity) {
        rowData.fee.value = `${price * quantity * state.targetAccount.stockBuyFeeRate}`;
      }
    });
    return copy;
  }

  // TODO: add the editorTransaction reducer methods here and potentially separate reducer after done
  if (action.type === Actions.ACCOUNT.ADMIN.EDITOR_TRANSACTION.STEP.INDEX.INCREMENT) {
    const maxIndex = state.editorTransaction.step.maxCount;
    const currentIndex = state.editorTransaction.step.index;
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : currentIndex;
    return Object.assign({}, state, {
      editorTransaction: {
        ...state.editorTransaction,
        step: {
          ...state.editorTransaction.step,
          index: newIndex,
        },
      },
    });
  } else if (action.type === Actions.ACCOUNT.ADMIN.EDITOR_TRANSACTION.STEP.INDEX.DECREMENT) {
    const currentIndex = state.editorTransaction.step.index;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    return Object.assign({}, state, {
      editorTransaction: {
        ...state.editorTransaction,
        step: {
          ...state.editorTransaction.step,
          index: newIndex,
        },
      },
    });
  }
  return state;
};

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
