// @flow

import DB from './index';

const UserSchema = new DB.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  phone: {
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
  collection: '_User', // DB table name
});

export default DB.model('_User', UserSchema); // Mongoose name
