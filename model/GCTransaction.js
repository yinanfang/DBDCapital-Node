// @flow

import Joi from 'joi-browser';
import Immutable from 'seamless-immutable';

import GCObject from './GCObject';

// Default object structure
const NewTransaction = Immutable({
  select: {
    key: 'select',
    value: false,
  },
  action: {
    key: 'action',
    BUY: 'Buy',
    SELL: 'Sell',
    value: 'Buy',
  },
  id: {
    key: 'id',
    name: 'ID',
  },
  symbol: {
    key: 'symbol',
    name: 'Symbol',
  },
  price: {
    key: 'price',
    name: 'Price',
  },
  quantity: {
    key: 'quantity',
    name: 'Quantity',
  },
  date: {
    key: 'date',
    name: 'Date',
  },
  note: {
    key: 'note',
    name: 'Note',
    multiLine: true,
  },
});

type GCTransactionType = {
  action: string,
  id: string,
  symbol: string,
  price: number,
  quantity: number,
  date: Date,
  note: string
};

class GCTransaction extends GCObject {
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
    // Use positive for Buy & negative for Sell
    if (action === 'Buy') {
      this.quantity = quantity > 0 ? quantity : -quantity;
    } else {
      this.quantity = quantity < 0 ? quantity : -quantity;
    }
    if (typeof date === 'string' && date.match(/^.*T.*Z$/)) {
      this.date = new Date(date);
    } else if (typeof date === 'string') {
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

export default GCTransaction;

export {
  NewTransaction,
};
