// @flow

import Joi from 'joi-browser';

import GCObject from './GCObject';

type GCTransactionType = {
  action: string,
  id: string,
  symbol: string,
  price: number,
  quantity: number,
  date: Date,
  note: string
};

export default class GCTransaction extends GCObject {
  action: string;
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  date: Date;
  note: string;

  constructor({ action = '', id = '', symbol = '', price = 0.00, quantity = 0, date = new Date(), note = '' }: GCTransactionType) {
    super();
    this.action = action;
    this.id = id;
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
    if (typeof date === 'string') {
      this.date = new Date(`${date} GMT+0800`);
    } else {
      this.date = date;
    }
    this.note = note;
  }

  schema = Joi.object().keys({
    action: Joi.string().required(),
    id: Joi.string().required(),
    symbol: Joi.string().alphanum().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    date: Joi.date().required(),
    note: Joi.string().required(),
    schema: Joi.object().required(),
  });

  validate() {
    return Joi.validate(this, this.schema);
  }
}
