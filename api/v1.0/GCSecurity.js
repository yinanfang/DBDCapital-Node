// @flow

import Parse, { ParseObject } from 'parse/node';
import Promise from 'bluebird';
import Joi from 'joi';

import logger from '../../utils/logger';

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

export default class GCSecurity {
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
    this.date = date;
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

  simple() {
    const { schema: _, ...otherKeys } = this;
    return otherKeys;
  }
}

const GCSecurityUtil = {
  find: async function _find(symbol: string) {
    const Security = Parse.Object.extend('Security');
    const query = new Parse.Query(Security);
    query.equalTo('symbol', symbol);
    query.descending('updatedAt');
    return query.find()
      .then((results) => {
        return results;
      }, (error) => {
        logger.debug('GCSecurityUtil.find: ', error);
      });
  },
  add: async function _add(stock: GCSecurity) {
    const Security = Parse.Object.extend('Security');
    const security = new Security();
    security.set('symbol', stock.symbol);
    security.set('name', stock.name);
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is added');
      }, (error) => {
        logger.debug('GCSecurityUtil.add', error);
      });
  },
  addAll: async function _addAll(stockList: GCSecurity[]) {
    await Promise.all(stockList.map(async (stock) => {
      await GCSecurityUtil.add(stock);
    }));
  },
  update: async function _update(security: ParseObject, stock: GCSecurity) {
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is updated');
      }, (error) => {
        logger.debug('GCSecurity.update', error);
      });
  },

  delete: async function _delete(security: ParseObject) {
    await security.destroy()
      .then((obj) => {
        logger.debug('GCSecurityUtil.deleted', obj);
      }, (error) => {
        logger.debug('GCSecurityUtil.delete failed: ', error);
      });
  },
  deleteAll: async function _deleteAll(stockList: ParseObject[]) {
    await Promise.all(stockList.map(async (stock) => {
      await GCSecurityUtil.delete(stock);
    }));
  },
};

export {
  GCSecurityUtil,
};
