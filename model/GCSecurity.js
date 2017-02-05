// @flow

import Joi from 'joi-browser';

import GCObject from './GCObject';

type GCSecurityType = {
  symbol: string,
  name: string,
  open: number,
  previousClose: number,
  lastPrice: number,
  high: number,
  low: number,
  bid: number,
  ask: number,
  volume: number,
  transactionValue: number,
  date: Date
};

export default class GCSecurity extends GCObject {
  symbol: string;
  name: string;
  open: number;
  previousClose: number;
  lastPrice: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  volume: number;
  transactionValue: number;
  date: Date;

  constructor({ symbol = '', name = '', open = 0.00, previousClose = 0.00, lastPrice = 0.00, high = 0.00, low = 0.00, bid = 0.00, ask = 0.00, volume = 0.00, transactionValue = 0.00, date = new Date() }: GCSecurityType) {
    super();
    this.symbol = symbol;
    this.name = name;
    this.open = open;
    this.previousClose = previousClose;
    this.lastPrice = lastPrice;
    this.high = high;
    this.low = low;
    this.bid = bid;
    this.ask = ask;
    this.volume = volume;
    this.transactionValue = transactionValue;
    if (typeof date === 'string') {
      this.date = new Date(this.date);
    } else {
      this.date = date;
    }
  }

  schema = Joi.object().keys({
    symbol: Joi.string().alphanum().required(),
    name: Joi.string().required(),
    open: Joi.number().required(),
    previousClose: Joi.number().required(),
    lastPrice: Joi.number().required(),
    high: Joi.number().required(),
    low: Joi.number().required(),
    bid: Joi.number().required(),
    ask: Joi.number().required(),
    volume: Joi.number().required(),
    transactionValue: Joi.number().required(),
    date: Joi.date().required(),
    schema: Joi.object().required(),
  });

  validate() {
    return Joi.validate(this, this.schema);
  }
}
