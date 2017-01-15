// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import faker from 'faker';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';

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

const SELECT = {
  key: 'select',
  value: false,
};
const DROPDOWN_ACTION = {
  key: 'action',
  BUY: 'Buy',
  SELL: 'Sell',
};
const DEFAULT_NEW_TRANSACTIONS_COUNT = 3;

const AccountAdmin = (props) => {
  const toggleSection = (event) => {
    const formElement = $(event.target).closest(`.${styleCSS.accountSectionContainer}`);

    formElement.find('form').first().slideToggle();

    const testElement = formElement.find('input[name="transactionId"]').first();
    console.log(testElement.val());
  };

  let newTransactionsCount = DEFAULT_NEW_TRANSACTIONS_COUNT;
  const newTransactionsAddEmptyRow = (event) => {
    newTransactionsCount++;
    console.log(newTransactionsCount);
  };

  const transactionIdExample = [86, 168, 355, 173, 853, '225b', '115c', '352d'];
  let newTransactions = _cloneDeep(props.newTransactions);
  const updateNewTransactions = (row = 0, inputName = '', content = '') => {
    newTransactions = _merge(newTransactions, {
      [row]: {
        [inputName]: content,
      },
    });
    console.log(newTransactions);
    props.newTransactionsInputUpdate(newTransactions);
  };

  const newTransactionColumnSelect = <TableRowColumn className={styleCSS.accountFormColumnSelect} style={{ padding: 0 }}><Checkbox /></TableRowColumn>;

  const transactionInputOnChange = (event, text) => {
    const row = $(event.target).closest('tr').index();
    const inputName = $(event.target).attr('name');
    updateNewTransactions(row, inputName, text);
  };
  const newTransactionColumnInput = (name = '', hint = '', multiLine = false) => {
    return (
      <TableRowColumn>
        <TextField fullWidth hintText={hint} name={name} onChange={transactionInputOnChange} multiLine={multiLine} />
      </TableRowColumn>
    );
  };
  const newTransactionColumnLongInput = (name = '', hint = '') => {
    return (
      <TableRowColumn className={styleCSS.accountInputLong}>
        <TextField fullWidth hintText={hint} name={name} onChange={transactionInputOnChange} multiLine />
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
    updateNewTransactions(payload.row, DROPDOWN_ACTION.key, payload.value);
  };
  const newTransactionColumnTypeDropdown = (row = 0, dropdownSelected = DROPDOWN_ACTION.BUY) => {
    const dropdownBuy = { row, value: DROPDOWN_ACTION.BUY };
    const dropdownSell = { row, value: DROPDOWN_ACTION.SELL };
    const dropdownValue = dropdownSelected === DROPDOWN_ACTION.BUY ? dropdownBuy : dropdownSell;
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
  const newTransactionColumnDatePicket = () => {
    return (
      <TableRowColumn>
        <DatePicker hintText="Date" autoOk shouldDisableDate={disableWeekends} />
      </TableRowColumn>
    );
  };

  const newTransactionRow = (row = 0, data = {}) => {
    return (
      <TableRow selectable={false} key={row}>
        {newTransactionColumnSelect}
        {newTransactionColumnTypeDropdown(row, DROPDOWN_ACTION.BUY)}
        {newTransactionColumnInput('transactionId', `${faker.random.arrayElement(transactionIdExample)}`)}
        {newTransactionColumnInput('symbol', faker.random.number({ min: 600000, max: 699999 }))}
        {newTransactionColumnInput('price', faker.commerce.price())}
        {newTransactionColumnDatePicket('date', 'yyyy-mm-dd')}
        {newTransactionColumnLongInput('note', 'Notes', true)}
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
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn className={styleCSS.accountInputLong}>Note</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {[...Array(newTransactionsCount)].map((_, index) => {
            return newTransactionRow(index);
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
  SELECT,
  DROPDOWN_ACTION,
  DEFAULT_NEW_TRANSACTIONS_COUNT,
};
