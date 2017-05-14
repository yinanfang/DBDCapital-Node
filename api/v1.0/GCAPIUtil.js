// @flow

import Parse, { ParseObject } from 'parse/node';
import Promise from 'bluebird';
import request from 'request-promise';
import iconv from 'iconv-lite';

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
    return security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is added');
        return obj;
      }, (error) => {
        logger.debug('GCSecurityUtil.add', error);
      });
  },
  addAll: async function _addAll(stockList: GCSecurity[]) {
    return Promise.all(stockList.map(async (stock) => {
      return GCSecurityUtil.add(stock);
    }));
  },
  update: async function _update(security: ParseObject, stock: GCSecurity) {
    security.set('lastPrice', stock.lastPrice);
    security.set('date', stock.date);
    return security.save(null)
      .then((obj) => {
        logger.debug(obj, 'is updated');
        return obj;
      }, (error) => {
        logger.debug('GCSecurity.update', error);
      });
  },
  updateAll: async function _updateAll(stockList: GCSecurity[]): Promise<{key: string, value: any}> {
    return Promise.all(stockList.map(async (stock) => {
      const results = await GCSecurityUtil.find(stock.symbol);
      if (results.length === 0) {
        const security = await GCSecurityUtil.add(stock);
        return { key: [stock.symbol], value: security };
      } else if (results.length > 1) {
        logger.debug('Found duplicates. Remove old ones.');
        await GCSecurityUtil.deleteAll(results.slice(1));
      }
      const target = results[0];
      const security = await GCSecurityUtil.update(target, stock);
      return { key: [stock.symbol], value: security };
    }))
    // Turn array into a map
    .then((result) => {
      return result.reduce((map, obj) => {
        map[obj.key] = obj.value;
        return map;
      }, {});
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

const GCUserUtil = {
  find: async function _find(userId: string): Parse.User {
    const queryUser = new Parse.Query(Parse.User);
    return queryUser.get(userId)
      .then((obj) => {
        logger.debug('get user done: ', obj);
        return obj;
      }, (error) => {
        logger.debug('get user failed: ', error);
      });
  },
};

const GCAccountUtil = {
  default: () => {},
};

const SinaStock = {
  // TODO: find out why Array<string|number> doesn't work?
  parseSecurityData: (symbol: string, data: Array<any>): GCSecurity => {
    const security = new GCSecurity({
      symbol,
      name: data[0],
      open: data[1],
      previousClose: Number.parseFloat(data[2]),
      lastPrice: Number.parseFloat(data[3]),
      high: Number.parseFloat(data[4]),
      low: Number.parseFloat(data[5]),
      bid: Number.parseFloat(data[6]),
      ask: Number.parseFloat(data[7]),
      volume: Number(data[8]),
      transactionValue: Number.parseFloat(data[9]),
      date: new Date(`${data[30]}T${data[31]}+08:00`), // Beijing(+8) -> UTC
    });
    return security;
  },
  // Return stock array
  lookup: async function lookup(symbolList: string[]): Promise<{stockList: GCSecurity[], errorList: GCSecurity[]}> {
    const url = `http://hq.sinajs.cn/list=${symbolList.join(',')}`;
    // Wait for promise and use promise result
    return request.get({
      url,
      encoding: null,
    })
    .then((response) => {
      const converted = iconv.decode(response, 'GBK').split('\n');
      converted.pop(); // pop the new line at the end
      const stockList = [];
      const errorList = [];
      converted.forEach((detailText) => {
        const parts = detailText.split('=');
        const symbol = parts[0].split('_').pop();
        const data = parts[1].split('"')[1].split(',');

        const security = SinaStock.parseSecurityData(symbol, data);
        const validation = security.validate();
        if (validation.error) {
          logger.debug('validation error->', validation.error.details);
          errorList.push(security);
        } else {
          stockList.push(security);
        }
      });

      // debug
      // logger.debug('stockList-------->');
      // GCObject.printSimpleArray(stockList);
      // logger.debug('errorList-------->');
      // GCObject.printSimpleArray(errorList);

      return { stockList, errorList };
    })
    .catch((error) => {
      logger.error('SinaStock error: ', error.message);
    });
  },
};

export {
  GCSecurityUtil,
  GCUserUtil,
  GCAccountUtil,
  SinaStock,
};
