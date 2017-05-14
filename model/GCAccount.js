// @flow

import Joi from 'joi-browser';

import GCObject from './GCObject';
import GCUser from './GCUser';

export type GCAccountType = {
  _id: string,
  name: string,
  owner: any,
  stockBuyFeeRate: number,
  stockSellFeeRate: number,
  _updatedAt: Date,
  _createdAt: Date
};

export default class GCAccount extends GCObject {
  _id: ?string;
  name: string;
  owner: any;
  stockBuyFeeRate: number;
  stockSellFeeRate: number;
  _updatedAt: ?Date;
  _createdAt: ?Date;

  constructor({
    _id = '',
    name = '',
    owner = {},
    stockBuyFeeRate = 0,
    stockSellFeeRate = 0,
    _updatedAt = new Date(),
    _createdAt = new Date(),
  }: GCAccountType) {
    super();
    this._id = _id;
    this.name = name;
    this.owner = owner;
    this.stockBuyFeeRate = stockBuyFeeRate;
    this.stockSellFeeRate = stockSellFeeRate;
    this._updatedAt = _updatedAt;
    this._createdAt = _createdAt;
  }

  static default() {
    return {
      _id: 'defaultId',
      name: 'defaultName',
      owner: GCUser.default(),
      stockBuyFeeRate: 0.01,
      stockSellFeeRate: 0.01,
      _updatedAt: new Date(),
      _createdAt: new Date(),
    };
  }

  schema = Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    owner: Joi.object().required(),
    stockBuyFeeRate: Joi.number().required(),
    stockSellFeeRate: Joi.number().required(),
    _updatedAt: Joi.date().required(),
    _createdAt: Joi.date().required(),
    schema: Joi.object().required(),
  });

  validate(): boolean {
    return Joi.validate(this, this.schema);
  }
}
