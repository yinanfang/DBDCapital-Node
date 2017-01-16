// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import faker from 'faker';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import Immutable from 'seamless-immutable';
import validator from 'validator';

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
    props.newTransactionsInputUpdate(newTransactionsDiff);
  };

  const updateNewTransactions = (row = 0, inputName = '', content = '') => {
    const updates = {
      value: content,
      error: '',
    };
    if (inputName === 'id') {
      console.log('gotcha!!!!!!!!');
      updates.error = validator.isAlphanumeric(content) ? '' : 'Format!';
    }
    newTransactionsDiff = _merge(newTransactionsDiff, {
      [row]: {
        [inputName]: updates,
      },
    });
    props.newTransactionsInputUpdate(newTransactionsDiff);
  };

  const newTransactionColumnSelect = <TableRowColumn className={styleCSS.accountFormColumnSelect} style={{ padding: 0 }}><Checkbox /></TableRowColumn>;

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
        {newTransactionColumnSelect}
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
            {newTransactionColumnSelect}
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
        <RaisedButton type="submit" label="Submit" className={styleCSS.accountSummit} />
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
  newTransactionsInputUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    newTransactions: state.account.admin.newTransactions,
  };
};

const connectedComponent = connect(mapStateToProps, {
  newTransactionsInputUpdate: Actions.accountNewTransactionsInputUpdate,
})(AccountAdmin);
export default {
  component: connectedComponent,
  DEFAULT_NEW_TRANSACTIONS: initNewTransactions(),
};
