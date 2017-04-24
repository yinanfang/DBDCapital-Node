// @flow

import Joi from 'joi-browser';
import Immutable from 'seamless-immutable';
import faker from 'faker';

import GCObject from './GCObject';

// Default object structure
export type GCNewTransactionInputDetailType = {
  key: string,
  value: boolean | string | number | Date,
  defaultValue?: Date,
  name: string,
  BUY?: string,
  SELL?: string,
  multiLine?: boolean,
  disabled?: boolean,
  hint?: string,
  error?: string
};

export type GCNewTransactionInputType = {
  select: GCNewTransactionInputDetailType,
  date: GCNewTransactionInputDetailType,
  transId: GCNewTransactionInputDetailType,
  symbol: GCNewTransactionInputDetailType,
  name: GCNewTransactionInputDetailType,
  action: GCNewTransactionInputDetailType,
  price: GCNewTransactionInputDetailType,
  quantity: GCNewTransactionInputDetailType,
  fee: GCNewTransactionInputDetailType,
  note: GCNewTransactionInputDetailType
};

const NewTransaction: GCNewTransactionInputType = Immutable({
  select: {
    key: 'select',
    value: false,
  },
  date: {
    key: 'date',
    name: 'Date',
  },
  transId: {
    key: 'transId',
    name: 'ID',
    hint: `${faker.random.arrayElement([86, 168, 355, 173, 853, '225b', '115c', '352d'])}`,
    value: '',
  },
  symbol: {
    key: 'symbol',
    name: 'Symbol',
    hint: faker.random.number({ min: 600000, max: 699999 }),
    value: '',
  },
  name: {
    key: 'name',
    name: 'Name',
    disabled: true,
    value: 'N/A',
  },
  action: {
    key: 'action',
    BUY: 'Buy',
    SELL: 'Sell',
    value: 'Buy',
    name: 'Action',
  },
  price: {
    key: 'price',
    name: 'Price',
    hint: faker.commerce.price(),
    value: '',
  },
  quantity: {
    key: 'quantity',
    name: 'Quantity',
    hint: faker.random.number({ min: 100, max: 10000 }),
    value: '',
  },
  fee: {
    key: 'fee',
    name: 'Fee',
    hint: faker.random.number({ min: 1, max: 10 }),
    value: '',
  },
  note: {
    key: 'note',
    name: 'Note',
    multiLine: true,
    hint: faker.lorem.words(),
    value: '',
  },
});

export type GCTransactionType = {
  date: Date,
  transId: string,
  symbol: string,
  action: string,
  price: number,
  quantity: number,
  fee?: number,
  note: string
};

class GCTransaction extends GCObject {
  date: Date;
  transId: string;
  symbol: string;
  action: string;
  price: number;
  quantity: number;
  fee: number;
  note: string;

  constructor({ date = new Date(), transId = '', symbol = '', action = '', price = 0.00, fee = 0.00, quantity = 0, note = '' }: GCTransactionType) {
    super();
    if (typeof date === 'string' && date.match(/^.*T.*Z$/)) {
      this.date = new Date(date);
    } else if (typeof date === 'string') {
      this.date = new Date(`${date} GMT+0800`);
    } else {
      this.date = date;
    }
    this.transId = transId;
    this.symbol = symbol;
    // Use positive for Buy & negative for Sell
    this.action = action;
    this.price = price;
    if (action === 'Buy') {
      this.quantity = quantity > 0 ? quantity : -quantity;
    } else {
      this.quantity = quantity < 0 ? quantity : -quantity;
    }
    this.fee = fee;
    this.note = note;
  }

  static default() {
    return {
      date: new Date(),
      transId: '',
      symbol: '',
      action: '',
      price: 0,
      quantity: 0,
      fee: 0,
      note: '',
    };
  }

  schema = Joi.object().keys({
    date: Joi.date().required(),
    transId: Joi.string().required(),
    symbol: Joi.string().alphanum().required(),
    action: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    fee: Joi.number().required(),
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
