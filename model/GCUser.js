// @flow

import Joi from 'joi-browser';
import Parse from 'parse';

import GCObject from './GCObject';

export type GCUserType = {
  _id: string,
  username: string,
  type: string,
  email: string,
  emailVerified: boolean,
  firstName: string,
  lastName: string,
  phone: string,
  _updatedAt: Date,
  _createdAt: Date
};

const Role = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

export default class GCUser extends GCObject {
  _id: ?string;
  username: string;
  type: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  _updatedAt: Date;
  _createdAt: Date;

  constructor({
    _id = '',
    username = '',
    type = Role.CLIENT,
    email = '',
    emailVerified = false,
    firstName = '',
    lastName = '',
    phone = '',
    _updatedAt = new Date(),
    _createdAt = new Date(),
  }: GCUserType) {
    super();
    this._id = _id;
    this.username = username;
    this.type = type;
    this.email = email;
    this.emailVerified = emailVerified;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this._updatedAt = _updatedAt;
    this._createdAt = _createdAt;
  }

  static default() {
    return {
      _id: 'defaultId',
      username: 'defaultUsername',
      type: Role.CLIENT,
      email: 'email@example.com',
      emailVerified: false,
      firstName: 'firstName',
      lastName: 'lastName',
      phone: '123-456-7890',
      _updatedAt: new Date(),
      _createdAt: new Date(),
    };
  }

  schema = Joi.object().keys({
    _id: Joi.string(),
    username: Joi.string().required(),
    type: Joi.string().required(),
    email: Joi.string().required(),
    emailVerified: Joi.boolean().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    _updatedAt: Joi.date().required(),
    _createdAt: Joi.date().required(),
    schema: Joi.object().required(),
  });

  validate(): boolean {
    return Joi.validate(this, this.schema);
  }

  static simplifyParseObject(user: Parse.User): { _id: string, username: string, type: string } {
    return {
      _id: user.id,
      username: user.getUsername(),
      // parseSessionToken: user.getSessionToken(),
      type: user.get('type'),
      // Need extra priviledge to get email: https://github.com/parse-community/parse-server/issues/3301
      // email: user.getEmail(),
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      phone: user.get('phone'),
    };
  }
}

export {
  Role,
};
