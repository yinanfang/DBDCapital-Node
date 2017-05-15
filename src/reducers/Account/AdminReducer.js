// @flow

import { combineReducers } from 'redux';
import { DEFAULT_STATE as DEFAULT_STATE_ACCOUNT_ADMIN } from '../../containers/Account/Admin';
import { DEFAULT_STATE } from '../../containers/Account/EditorTransaction';

import Actions from '../../actions';
import type { GCActionType } from '../../actions';
// import type { GCAccountType } from '../../../model/GCAccount';

// TODO: Deprecated. Deleate after the transaction editor is done
const targetAccountReducer = (state = DEFAULT_STATE_ACCOUNT_ADMIN.targetAccount, action: GCActionType) => {
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
const newTransactionsReducer = (state = DEFAULT_STATE_ACCOUNT_ADMIN.newTransactions, action: GCActionType) => {
  if (action.type === Actions.ACCOUNT.ADMIN.NEW_TRANSACTIONS.UPDATE) {
    return Object.assign({}, state, action.newTransactions);
  }
  return state;
};

const editorTransactionStepReducer = (state = DEFAULT_STATE.step, action: GCActionType) => {
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

const editorTransactionSelectReducer = (state = DEFAULT_STATE.select, action: GCActionType) => {
  if (action.type === Actions.ACCOUNT.ADMIN.EDITOR_TRANSACTION.SELECT.ALL_ACCOUNTS.SUCCESS) {
    return {
      allAccounts: action.accounts,
    };
  }
  return state;
};

const editorTransactionReducer = (state = DEFAULT_STATE, action: GCActionType) => {
  return {
    ...state,
    step: editorTransactionStepReducer(state.step, action),
    select: editorTransactionSelectReducer(state.select, action),
  };
};

const AdminReducer = combineReducers({
  targetAccount: targetAccountReducer,
  newTransactions: newTransactionsReducer,
  editorTransaction: editorTransactionReducer,
});

export default AdminReducer;
