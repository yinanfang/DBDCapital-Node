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
  _p_security: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  collection: 'Position', // DB table name
});

export default DB.model('Position', PositionSchema);
