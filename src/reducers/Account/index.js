// @flow

import { combineReducers } from 'redux';

// import Actions from '../../actions';
import AdminReducer from './AdminReducer';

const AccountReducer = combineReducers({
  common: (state = {}, action) => state,
  overview: (state = {}, action) => state,
  admin: AdminReducer,
});

export default AccountReducer;
