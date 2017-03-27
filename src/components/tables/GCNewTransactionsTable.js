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
    return (
      <TableRowColumn className={styleCSS.accountTransactionType}>
        <DropDownMenu id="type" value={dropdownValue} onChange={newTransactionTypeOnChange}>
          <MenuItem value={dropdownBuy} primaryText="Buy" />
          <MenuItem value={dropdownSell} primaryText="Sell" />
        </DropDownMenu>
      </TableRowColumn>
    );
  };

  const newTransactionColumnInput = (col = {}) => {
    return (
      <TableRowColumn className={col.multiLine ? styleCSS.accountInputLong : ''} style={{ 'padding-right': 0 }}>
        <TextField fullWidth name={col.key} hintText={col.hint} errorText={col.error} onChange={newTransactionInputOnChange} multiLine={col.multiLine} />
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

  return (
    <Paper className={styleCSS.accountSectionContainer}>
      <div onTouchTap={toggleSection}>
        <h2>New Transactions!!!</h2>
      </div>
      <form name="newTransactions">
        <Table selectable>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              {newTransactionColumnSelect()}
              <TableHeaderColumn className={styleCSS.accountTransactionType}>Action</TableHeaderColumn>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Symbol</TableHeaderColumn>
              <TableHeaderColumn>Price</TableHeaderColumn>
              <TableHeaderColumn>Quantity</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountDatePicker}>Date</TableHeaderColumn>
              <TableHeaderColumn className={styleCSS.accountInputLong}>Note</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {[...Array(newTransactionsCount)].map((_, i) => {
              const index = String(i);
              return (
                <TableRow
                  selectable={false}
                  key={index} // eslint-disable-line react/no-array-index-key
                >
                  {newTransactionColumnSelect(newTransactions[index].select.value)}
                  {newTransactionColumnTypeDropdown(index, newTransactions[index].action)}
                  {newTransactionColumnInput(newTransactions[index].transId)}
                  {newTransactionColumnInput(newTransactions[index].symbol)}
                  {newTransactionColumnInput(newTransactions[index].price)}
                  {newTransactionColumnInput(newTransactions[index].quantity)}
                  {newTransactionColumnDatePicket(newTransactions[index].date.key, newTransactions[index].date.defaultValue)}
                  {newTransactionColumnInput(newTransactions[index].note)}
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
