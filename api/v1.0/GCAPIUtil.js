// @flow

import Parse, { ParseObject } from 'parse/node';
import Promise from 'bluebird';

import GCSecurity from '../../model/GCSecurity';
import logger from '../../utils/logger';

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
    return await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is added');
        return obj;
      }, (error) => {
        logger.debug('GCSecurityUtil.add', error);
      });
  },
  addAll: async function _addAll(stockList: GCSecurity[]) {
    return await Promise.all(stockList.map(async (stock) => {
      return await GCSecurityUtil.add(stock);
    }));
  },
  update: async function _update(security: ParseObject, stock: GCSecurity) {
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    return await security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is updated');
        return obj;
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
