// @flow

import DB from './index';

const SecuritySchema = new DB.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
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
  collection: 'Security', // DB table name
});

export default DB.model('Security', SecuritySchema); // Mongoose name
