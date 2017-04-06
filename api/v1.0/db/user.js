// @flow

import DB from './index';

const UserSchema = new DB.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ame: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
});

UserSchema.methods.setPassword = (password) => {
  // this.salt = crypto.randomBytes(16).toString('hex');
  // this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = (password) => {
  // var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  // return this.hash === hash;
};

UserSchema.methods.generateJwt = () => {
  // var expiry = new Date();
  // expiry.setDate(expiry.getDate() + 7);
  //
  // return jwt.sign({
  //   _id: this._id,
  //   email: this.email,
  //   name: this.name,
  //   exp: parseInt(expiry.getTime() / 1000),
  // }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// DB.model('User', UserSchema);

export default UserSchema;
