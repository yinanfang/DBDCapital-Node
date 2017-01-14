// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

import Actions from '../actions';
import styleCSS from '../style.css';

const AccountAdmin = (props) => {
  const toggleSection = (event) => {
    // console.log(event);
    // console.log(event.target);
    // console.log($(event.target).closest('form').find('#test').first().html());
    // $(`form[name="${form.login.key}"] input[name="${form.login.username.name}"]`).val(),
    // $(`form[name="${form.login.key}"] input[name="${form.login.password.name}"]`).val(),
    const formElement = $(event.target).closest(`.${styleCSS.accountSectionContainer}`);

    formElement.find('form').first().slideToggle();

    const testElement = formElement.find('input[name="id"]').first();
    console.log(testElement.val());
  };

  return (
    <div>
      <Paper className={styleCSS.accountSectionContainer}>
        <div onTouchTap={toggleSection}>
          <h2>New Transactions</h2>
        </div>
        <form name="newTransactions">
          <Table selectable>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn className={styleCSS.accountFormColumnSelect}><Checkbox /></TableHeaderColumn>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Symbol</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Action</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow selectable={false}>
                <TableRowColumn className={styleCSS.accountFormColumnSelect}><Checkbox /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="168 / 186b" name="id" /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="600000" name="symbol" /></TableRowColumn>
                <TableRowColumn>Randal White</TableRowColumn>
                <TableRowColumn>Buy</TableRowColumn>
                <TableRowColumn>11.3</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn className={styleCSS.accountFormColumnSelect}><Checkbox /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="168 / 186b" name="id" /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="600000" name="symbol" /></TableRowColumn>
                <TableRowColumn>Randal White</TableRowColumn>
                <TableRowColumn>Sell</TableRowColumn>
                <TableRowColumn>222</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn className={styleCSS.accountFormColumnSelect}><Checkbox /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="168 / 186b" name="id" /></TableRowColumn>
                <TableRowColumn><TextField fullWidth hintText="600000" name="symbol" /></TableRowColumn>
                <TableRowColumn>Stephanie Sanders</TableRowColumn>
                <TableRowColumn>Buy</TableRowColumn>
                <TableRowColumn>2111</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      </Paper>

      <h2>Next</h2>
    </div>
  );
};

AccountAdmin.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  isMobileDrawer: PropTypes.bool.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  uiUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isMobileDrawer: state.uiStore.isMobileDrawer,
    isDrawerOpen: state.uiStore.isDrawerOpen,
  };
};

export default connect(mapStateToProps, {
  uiUpdate: Actions.uiUpdate,
})(AccountAdmin);
