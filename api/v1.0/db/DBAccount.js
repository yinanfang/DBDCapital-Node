// @flow

import DB from './index';

const AccountSchema = new DB.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  _p_owner: {
    type: String,
    ref: '_User',
    required: true,
  },
  stockBuyFeeRate: {
    type: Number,
    required: true,
  },
  stockSellFeeRate: {
    type: Number,
    required: true,
  },
  _p_account: {
    type: String,
    required: true,
  },
  _updated_at: {
    type: Date,
    required: true,
  },
  _created_at: {
    type: Date,
    required: true,
  },
}, {
  collection: 'Account', // DB table name
});

export default DB.model('Account', AccountSchema); // Mongoose name
