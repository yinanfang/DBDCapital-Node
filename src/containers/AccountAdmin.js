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
const initSingleNewTransaction = () => {
  const copy = _cloneDeep(NewTransaction);
  copy.id.hint = `${faker.random.arrayElement([86, 168, 355, 173, 853, '225b', '115c', '352d'])}`;
  copy.symbol.hint = faker.random.number({ min: 600000, max: 699999 });
  copy.price.hint = faker.commerce.price();
  copy.date.hint = moment(faker.date.recent()).format('YYYY-MM-DD');
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
  const newTransactionColumnDatePicket = (name = '', hint = '') => {
    return (
      <TableRowColumn className={styleCSS.accountDatePicker}>
        <DatePicker name={name} hintText={hint} autoOk shouldDisableDate={disableWeekends} onTouchTap={newTransactionDateOnTouchTap} onChange={newTransactionDateOnChange} />
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
        {newTransactionColumnDatePicket(trans.date.key, trans.date.hint)}
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
    const selectedTransactions = Object.keys(props.newTransactions)
      .filter(index => props.newTransactions[index].select.value === true)
      .reduce((obj, index) => {
        obj[index] = props.newTransactions[index];
        return obj;
      }, {});
    console.log(selectedTransactions);
    const passSanityCheck = Object.keys(selectedTransactions)
      .reduce((isValid, index) => {
        const trans = selectedTransactions[index];
        return isValid
          && !_isEmpty(trans.id.value) && validator.isAlphanumeric(trans.id.value)
          && !_isEmpty(trans.symbol.value) && validator.isNumeric(trans.symbol.value)
          && !_isEmpty(trans.price.value) && validator.isCurrency(trans.price.value)
          && !_isEmpty(trans.date.value) && validator.isDate(trans.date.value);
      }, true);
    if (passSanityCheck) {
      // post result
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
        <RaisedButton type="submit" onClick={newTransactionSubmitOnClick} label="Submit" className={styleCSS.accountSummit} />
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
};

const mapStateToProps = (state) => {
  return {
    newTransactions: state.account.admin.newTransactions,
  };
};

const connectedComponent = connect(mapStateToProps, {
  newTransactionsUpdate: Actions.accountNewTransactions.update,
})(AccountAdmin);
export default {
  component: connectedComponent,
  DEFAULT_NEW_TRANSACTIONS: initNewTransactions(),
};
