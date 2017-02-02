// @flow

import Parse from 'parse/node';
import Promise from 'bluebird';

import logger from '../../utils/logger';

// Add types after the ticket is completed
// https://flowtype.org/docs/classes.html
// https://github.com/babel/babylon/issues/321
export default class GCStock {
  symbol;
  name;
  open;
  previousClose;
  lastPrice;
  high;
  low;
  bid;
  ask;
  volume;
  transactionValue;
  date;

  constructor({ symbol = '', name = '', open = 0.00, previousClose = 0.00, lastPrice = 0.00, high = 0.00, low = 0.00, bid = 0.00, ask = 0.00, volume = 0.00, transactionValue = 0.00, date = new Date() }) {
    this.symbol = symbol; // string
    this.name = name; // string
    this.open = open; // number
    this.previousClose = previousClose; // number
    this.lastPrice = lastPrice; // number
    this.high = high; // number
    this.low = low; // number
    this.bid = bid; // number
    this.ask = ask; // number
    this.volume = volume; // number
    this.transactionValue = transactionValue; // number
    this.date = date; // date
  }
}

const GCStockUtil = {
  find: async function _find(symbol) {
    const Security = Parse.Object.extend('Security');
    const query = new Parse.Query(Security);
    query.equalTo('symbol', symbol);
    query.descending('updatedAt');
    return query.find()
      .then((results) => {
        return results;
      }, (error) => {
        logger.debug('GCStock.Util.find: ', error);
      });
  },
  add: async function _add(stock) {
    const Security = Parse.Object.extend('Security');
    const security = new Security();
    security.set('symbol', stock.symbol);
    security.set('name', stock.name);
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is saved');
      }, (error) => {
        logger.debug('GCStock.Util.add', error);
      });
  },
  addAll: async function _addAll(stockList) {
    await Promise.all(stockList.map(async (stock) => {
      await GCStockUtil.add(stock);
    }));
  },
  update: async function _update(security, stock) {
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is updated');
      }, (error) => {
        logger.debug('GCStock.Util.update', error);
      });
  },

  delete: async function _delete(stock) {
    await stock.destroy()
      .then((obj) => {
        logger.debug('GCStock.Util.deleted', obj);
      }, (error) => {
        logger.debug('GCStock.Util.delete failed: ', error);
      });
  },
  deleteAll: async function _deleteAll(stockList) {
    await Promise.all(stockList.map(async (stock) => {
      await GCStockUtil.delete(stock);
    }));
  },
};

export {
  GCStockUtil,
}
