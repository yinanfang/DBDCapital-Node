// @flow

import React, { PropTypes } from 'react';
import $ from 'jquery';
import moment from 'moment';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import styleCSS from '../../style.css';

import { NewTransaction } from '../../../model/GCTransaction';
import type { GCNewTransactionInputType } from '../../../model/GCTransaction';

const GCNewTransactionsTable = ({
  // data
  newTransactions,
  // function
  toggleSection,
  newTransactionsAddEmptyRow,
  newTransactionSubmitOnClick,
  newTransactionsTableRowOnCheck,
  newTransactionTypeOnChange,
  newTransactionInputOnChange,
  updateNewTransactions,
}: {
  // data
  newTransactions: { [key: string]: GCNewTransactionInputType },
  // function
  toggleSection: (event: any) => void,
  newTransactionsAddEmptyRow: (event: any) => void,
  newTransactionSubmitOnClick: (event: any) => void,
  newTransactionsTableRowOnCheck: (event: any, isInputChecked: boolean) => void,
  newTransactionTypeOnChange: (event: any, index: number, payload: any) => void,
  newTransactionInputOnChange: (event: any, text: string) => void,
  updateNewTransactions: (row: number, inputName: string, content: string) => void
}) => {
  const newTransactionsCount = Object.keys(newTransactions).length;
  const tableRowColumnStyle = { paddingLeft: '5px', paddingRight: 0 };

  const newTransactionColumnSelect = (selected = false) => {
    return (
      <TableRowColumn className={styleCSS.accountFormColumnSelect} style={{ padding: 0 }}>
        <Checkbox defaultChecked={selected} onCheck={newTransactionsTableRowOnCheck} />
      </TableRowColumn>
    );
  };

  const newTransactionColumnTypeDropdown = (row = 0, col = { value: NewTransaction.action.BUY }) => {
    const dropdownBuy = { row, value: NewTransaction.action.BUY };
    const dropdownSell = { row, value: NewTransaction.action.SELL };
    const dropdownValue = col.value === NewTransaction.action.BUY ? dropdownBuy : dropdownSell;
    const tableRowColumnDropdownStyle = { bottom: '4px' };
    return (
      <TableRowColumn className={styleCSS.accountTransactionType} style={tableRowColumnStyle}>
        <DropDownMenu id="type" value={dropdownValue} onChange={newTransactionTypeOnChange} underlineStyle={tableRowColumnDropdownStyle}>
          <MenuItem value={dropdownBuy} primaryText="Buy" />
          <MenuItem value={dropdownSell} primaryText="Sell" />
        </DropDownMenu>
      </TableRowColumn>
    );
  };

  const newTransactionColumnInput = (col = {}, cssClassName = '') => {
    return (
      <TableRowColumn className={cssClassName} style={tableRowColumnStyle}>
        <TextField fullWidth name={col.key} hintText={col.hint} errorText={col.error} onChange={newTransactionInputOnChange} multiLine={col.multiLine} />
      </TableRowColumn>
    );
  };

  const newTransactionColumnLabel = (col = {}, cssClassName = '') => {
    return (
      <TableRowColumn className={cssClassName} style={tableRowColumnStyle}>
        <TextField fullWidth name={col.key} hintText={col.value} errorText={col.error} disabled={col.disabled} underlineDisabledStyle={{ borderBottom: '1px solid', borderBottomColor: 'rgb(224, 224, 224)' }} />
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
      <TableRowColumn className={styleCSS.accountDatePicker} style={tableRowColumnStyle}>
        <DatePicker name={name} autoOk defaultDate={defaultValue} shouldDisableDate={disableWeekends} onTouchTap={newTransactionDateOnTouchTap} onChange={newTransactionDateOnChange} />
      </TableRowColumn>
    );
  };

  return (
    <Paper className={styleCSS.accountSectionContainer}>
      <div onTouchTap={toggleSection}>
        <h2>New Transactions</h2>
      </div>
      <form name="newTransactions">
        <Table selectable>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              {newTransactionColumnSelect()}
              <TableHeaderColumn className={styleCSS.accountDatePicker} style={tableRowColumnStyle}>Date</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputId} style={tableRowColumnStyle}>ID</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountSymbol} style={tableRowColumnStyle}>Symbol</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputName} style={tableRowColumnStyle}>Name</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountTransactionType} style={tableRowColumnStyle}>Action</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputPrice} style={tableRowColumnStyle}>Price</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputQuantity} style={tableRowColumnStyle}>Quantity</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputFee} style={tableRowColumnStyle}>Fee</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputLong} style={tableRowColumnStyle}>Note</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {[...Array(newTransactionsCount)].map((_, i) => {
              const index = String(i);
              const transaction = newTransactions[index];
              return (
                <TableRow
                  selectable={false}
                  key={index} // eslint-disable-line react/no-array-index-key
                >
                  {newTransactionColumnSelect(transaction.select.value)}
                  {newTransactionColumnDatePicket(transaction.date.key, transaction.date.defaultValue)}
                  {newTransactionColumnInput(transaction.transId, styleCSS.accountInputId)}
                  {newTransactionColumnInput(transaction.symbol, styleCSS.accountSymbol)}
                  {newTransactionColumnLabel(transaction.name, styleCSS.accountInputName)}
                  {newTransactionColumnTypeDropdown(index, transaction.action)}
                  {newTransactionColumnInput(transaction.price, styleCSS.accountInputPrice)}
                  {newTransactionColumnInput(transaction.quantity, styleCSS.accountInputQuantity)}
                  {newTransactionColumnInput(transaction.fee, styleCSS.accountInputFee)}
                  {newTransactionColumnInput(transaction.note, styleCSS.accountInputLong)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <RaisedButton label="Add A Row" onClick={newTransactionsAddEmptyRow} />
        <RaisedButton type="submit" onClick={newTransactionSubmitOnClick} label="Submit" className={styleCSS.accountSubmit} />
      </form>
    </Paper>
  );
};

// TODO: implement a better prop type validataion. See if can re-use type in GCTransaction.js
GCNewTransactionsTable.propTypes = {
  // Injected by React Redux
  newTransactions: PropTypes.objectOf(PropTypes.shape({
    select: PropTypes.object,
  })).isRequired,
};

export default GCNewTransactionsTable;
