// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import faker from 'faker';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import Immutable from 'seamless-immutable';
import validator from 'validator';
import sweetAlert from 'sweetalert';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import Actions from '../actions';
import styleCSS from '../style.css';

const DEFAULT_NEW_TRANSACTIONS_COUNT = 3;
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
const getPreviousWorkday = () => {
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
const initSingleNewTransaction = () => {
  const copy = _cloneDeep(NewTransaction);
  copy.id.hint = `${faker.random.arrayElement([86, 168, 355, 173, 853, '225b', '115c', '352d'])}`;
  copy.symbol.hint = faker.random.number({ min: 600000, max: 699999 });
  copy.price.hint = faker.commerce.price();
  const previousWorkday = getPreviousWorkday();
  copy.date.defaultValue = previousWorkday.toDate();
  copy.date.value = previousWorkday.format('YYYY-MM-DD');
  copy.note.hint = faker.lorem.words();
  return copy;
};
const initNewTransactions = () => {
  const result = {};
  for (let i = 0; i < DEFAULT_NEW_TRANSACTIONS_COUNT; i++) {
    result[i] = initSingleNewTransaction();
  }
  return result;
};

const AccountAdmin = (props) => {
  const newTransactionsCount = Object.keys(props.newTransactions).length;
  let newTransactionsDiff = {};

  const toggleSection = (event) => {
    const formElement = $(event.target).closest(`.${styleCSS.accountSectionContainer}`);
    formElement.find('form').first().slideToggle();
    const testElement = formElement.find('input[name="transactionId"]').first();
    console.log(testElement.val());
  };

  const newTransactionsAddEmptyRow = (event) => {
    newTransactionsDiff[newTransactionsCount] = initSingleNewTransaction();
    props.newTransactionsUpdate(newTransactionsDiff);
  };

  const updateNewTransactions = (row = 0, inputName = '', content = '') => {
    const updates = {
      value: content,
      error: '',
    };
    if (inputName === NewTransaction.id.key) {
      updates.error = validator.isAlphanumeric(content) ? '' : 'Format!';
    } else if (inputName === NewTransaction.symbol.key) {
      updates.error = validator.isNumeric(content) ? '' : 'Numbers only!';
    } else if (inputName === NewTransaction.price.key) {
      updates.error = validator.isCurrency(content) ? '' : 'Currency only!';
    }
    newTransactionsDiff = _merge(newTransactionsDiff, {
      [row]: {
        [inputName]: updates,
      },
    });
    props.newTransactionsUpdate(newTransactionsDiff);
  };

  const newTransactionSelectSingle = (event, isInputChecked) => {
    const row = $(event.target).closest('tr').index();
    updateNewTransactions(row, NewTransaction.select.key, isInputChecked);
  };
  const newTransactionSelectAll = (event, isInputChecked) => {
    console.log(isInputChecked, $(event.target).parents());
  };
  const newTransactionColumnSelect = (col = null) => {
    if (col) {
      return (
        <TableRowColumn className={styleCSS.accountFormColumnSelect} style={{ padding: 0 }}>
          <Checkbox defaultChecked={col.value} onCheck={newTransactionSelectSingle} />
        </TableRowColumn>
      );
    }
    return (
      <TableRowColumn className={styleCSS.accountFormColumnSelect} style={{ padding: 0 }}>
        <Checkbox onCheck={newTransactionSelectAll} />
      </TableRowColumn>
    );
  };

  const transactionInputOnChange = (event, text) => {
    const row = $(event.target).closest('tr').index();
    const inputName = $(event.target).attr('name');
    updateNewTransactions(row, inputName, text);
  };
  const newTransactionColumnInput = (col = {}) => {
    if (col.multiLine) {
      return (
        <TableRowColumn className={styleCSS.accountInputLong}>
          <TextField fullWidth name={col.key} hintText={col.hint} errorText={col.error} onChange={transactionInputOnChange} multiLine />
        </TableRowColumn>
      );
    }
    return (
      <TableRowColumn>
        <TextField fullWidth name={col.key} hintText={col.hint} errorText={col.error} onChange={transactionInputOnChange} />
      </TableRowColumn>
    );
  };

  const transactionTypeOnChange = (event, index, payload) => {
    console.log(index, payload);
    $('form[name="newTransactions"] table:eq(1)')
      .find('tr')
      .eq(payload.row)
      .find('#type div div:eq(1)')
      .text(payload.value);
    updateNewTransactions(payload.row, NewTransaction.action.key, payload.value);
  };
  const newTransactionColumnTypeDropdown = (row = 0, col = { value: NewTransaction.action.BUY }) => {
    const dropdownBuy = { row, value: NewTransaction.action.BUY };
    const dropdownSell = { row, value: NewTransaction.action.SELL };
    const dropdownValue = col.value === NewTransaction.action.BUY ? dropdownBuy : dropdownSell;
    return (
      <TableRowColumn className={styleCSS.accountTransactionType}>
        <DropDownMenu id="type" value={dropdownValue} onChange={transactionTypeOnChange}>
          <MenuItem value={dropdownBuy} primaryText="Buy" />
          <MenuItem value={dropdownSell} primaryText="Sell" />
        </DropDownMenu>
      </TableRowColumn>
    );
  };

  const disableWeekends = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
  let newTransactionDatePickerRow = 0;
  const newTransactionDateOnTouchTap = (event) => {
    newTransactionDatePickerRow = $(event.target).closest('tr').index();
  };
  const newTransactionDateOnChange = (event, date) => {
    updateNewTransactions(newTransactionDatePickerRow, 'date', moment(date).format('YYYY-MM-DD'));
  };
  const newTransactionColumnDatePicket = (name = '', defaultValue = new Date()) => {
    return (
      <TableRowColumn className={styleCSS.accountDatePicker}>
        <DatePicker name={name} autoOk defaultDate={defaultValue} shouldDisableDate={disableWeekends} onTouchTap={newTransactionDateOnTouchTap} onChange={newTransactionDateOnChange} />
      </TableRowColumn>
    );
  };

  const newTransactionRow = (row = 0, trans = {}) => {
    return (
      <TableRow selectable={false} key={row}>
        {newTransactionColumnSelect(trans.select)}
        {newTransactionColumnTypeDropdown(row, trans.action)}
        {newTransactionColumnInput(trans.id)}
        {newTransactionColumnInput(trans.symbol)}
        {newTransactionColumnInput(trans.price)}
        {newTransactionColumnDatePicket(trans.date.key, trans.date.defaultValue)}
        {newTransactionColumnInput(trans.note)}
      </TableRow>
    );
  };

  const newTransactionsTable = () => {
    return (
      <Table selectable>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            {newTransactionColumnSelect()}
            <TableHeaderColumn className={styleCSS.accountTransactionType}>Action</TableHeaderColumn>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Symbol</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
            <TableHeaderColumn className={styleCSS.accountDatePicker}>Date</TableHeaderColumn>
            <TableHeaderColumn className={styleCSS.accountInputLong}>Note</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {[...Array(newTransactionsCount)].map((_, index) => {
            return newTransactionRow(index, props.newTransactions[index]);
          })}
        </TableBody>
      </Table>
    );
  };

  const newTransactionSubmitOnClick = (event) => {
    event.preventDefault();
    // http://stackoverflow.com/questions/38750705/using-es6-to-filter-object-properties
    const allTrans = props.newTransactions;
    const selectedTransactions = Object.keys(allTrans)
      .filter(key => allTrans[key].select.value === true)
      .reduce((obj, key) => {
        const singleTrans = allTrans[key];
        const simplified = Object.keys(singleTrans)
          .reduce((transItem, transKey) => {
            transItem[transKey] = singleTrans[transKey].value;
            return transItem;
          }, {});
        obj[key] = simplified;
        return obj;
      }, {});
    console.log('selectedTransactions', selectedTransactions);
    const passSanityCheck = Object.keys(selectedTransactions)
      .reduce((isValid, key) => {
        const trans = selectedTransactions[key];
        return isValid
          && !_isEmpty(trans.id) && validator.isAlphanumeric(trans.id)
          && !_isEmpty(trans.symbol) && validator.isNumeric(trans.symbol)
          && !_isEmpty(trans.price) && validator.isCurrency(trans.price)
          && !_isEmpty(trans.date) && validator.isDate(trans.date);
      }, true);
    if (Object.keys(selectedTransactions).length !== 0 && passSanityCheck) {
      props.newTransactionsSubmit(selectedTransactions);
    } else {
      sweetAlert('Oops...', 'Something went wrong!', 'error');
    }
  };

  return (
    <div>
      <Paper className={styleCSS.accountSectionContainer}>
        <div onTouchTap={toggleSection}>
          <h2>New Transactions</h2>
        </div>
        <form name="newTransactions">
          {newTransactionsTable()}
        </form>
        <RaisedButton label="Add A Row" onClick={newTransactionsAddEmptyRow} />
        <RaisedButton type="submit" onClick={newTransactionSubmitOnClick} label="Submit" className={styleCSS.accountSubmit} />
      </Paper>
      <h2>Next</h2>
    </div>
  );
};

AccountAdmin.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  newTransactions: PropTypes.object.isRequired,
  newTransactionsUpdate: PropTypes.func.isRequired,
  newTransactionsSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    newTransactions: state.account.admin.newTransactions,
  };
};
const mapDispatchToProps = {
  newTransactionsUpdate: Actions.accountNewTransactions.update,
  newTransactionsSubmit: Actions.accountNewTransactions.submit,
};
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(AccountAdmin);
export default {
  component: connectedComponent,
  DEFAULT_NEW_TRANSACTIONS: initNewTransactions(),
};
