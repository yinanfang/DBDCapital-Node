// @flow

import DB from './index';
// var crypto = require('crypto');
// var jwt = require('jsonwebtoken');

const OpenPositionSchema = new DB.Schema({
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
  collection: 'OpenPosition',
});

export default DB.model('OpenPosition', OpenPositionSchema);
