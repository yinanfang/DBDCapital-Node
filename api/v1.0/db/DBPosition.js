// @flow

import DB from './index';
// var crypto = require('crypto');
// var jwt = require('jsonwebtoken');

const PositionSchema = new DB.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  closed: {
    type: Boolean,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  transId: {
    type: String,
    required: true,
  },
  _p_security: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  _p_owner: {
    type: String,
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
  collection: 'Position', // DB table name
});

export default DB.model('Position', PositionSchema);
