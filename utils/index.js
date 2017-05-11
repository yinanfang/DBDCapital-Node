// @flow
import moment from 'moment';

const parseAuthHeader = (authHeader: string) => {
  const elements = authHeader.split(' ');
  if (elements.length === 2) {
    const scheme = elements[0];
    if (scheme === 'Bearer') {
      return elements[1];
    }
  }
  return '';
};

const getJWTFromHttpObject = (httpObject: Request) => {
  const authHeader = httpObject.headers.authorization;
  if (authHeader) {
    return parseAuthHeader(authHeader);
  }
  return '';
};

// const toggleCloestForm = (event) => {
//   const formElement = $(event.target).closest(`.${styleCSS.accountSectionContainer}`);
//   formElement.find('form').first().slideToggle();
// };

/**
 * Prefix market string for API call
 * @param  {[type]} symbol e.g. 600635
 * @return {[type]}        e.g. sh600635
 */
const convertToAttributedSymbol = (symbol: string) => {
  if (symbol) {
    if (symbol.match(/^((600|601|603|900)\d{3})|(204(001|002|003|004|007|014|028|091|182))$/)) {
      // 沪市 - A股: 600, 601, 603; B股: 900; 国债回购: 204
      return `sh${symbol}`;
    } else if (symbol.match(/^((000|002|200|300)\d{3})|(1318([01][0123569]))$/)) {
      // 深市 - A股: 000; 中小板: 002; B股: 200; 创业板: 300; 国债回购: 1318
      return `sz${symbol}`;
    }
  }
  return null;
};

const previousWorkday = () => {
  const today = moment();
  const day = today.day();
  let diff = 0;
  if (day === 6) {
    diff = 1;
  } else if (day === 0) {
    diff = 2;
  }
  return today.subtract(diff, 'days');
};

export default {
  convertToAttributedSymbol,
  getJWTFromHttpObject,
  parseAuthHeader,
  previousWorkday,
  UI: {
  },
};
