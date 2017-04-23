// @flow

import Joi from 'joi-browser';

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
}

export {
  Role,
};
