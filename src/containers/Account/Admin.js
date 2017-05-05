// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import validator from 'validator';
import sweetAlert from 'sweetalert';

import Actions from '../../actions';
import styleCSS from '../../style.css';

import GCNewTransactionsTable from '../../components/tables/GCNewTransactionsTable';
import GCTransaction, { NewTransaction } from '../../../model/GCTransaction';
import GCAccount from '../../../model/GCAccount';
import type { GCTransactionType, GCNewTransactionInputType } from '../../../model/GCTransaction';
import GCUtil from '../../../utils';

const DEFAULT_NEW_TRANSACTIONS_COUNT = 3;
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
  const previousWorkday = getPreviousWorkday();
  copy.date.defaultValue = previousWorkday.toDate();
  copy.date.value = previousWorkday.format('YYYY-MM-DD');
  return copy;
};
const initNewTransactions = () => {
  const result = {};
  for (let i = 0; i < DEFAULT_NEW_TRANSACTIONS_COUNT; i++) {
    result[i] = initSingleNewTransaction();
  }
  return result;
};
const DEFAULT_STATE = {
  targetAccount: GCAccount.default(),
  newTransactions: initNewTransactions(),
};

const AccountAdmin = (props) => {
  const newTransactionsCount = Object.keys(props.newTransactions).length;
  let newTransactionsDiff = {};

  const toggleSection = (event) => {
    const formElement = $(event.target).closest(`.${styleCSS.accountSectionContainer}`);
    formElement.find('form').first().slideToggle();
  };

  const newTransactionsUpdateAccount = (event, accountId: string): void => {
    console.log(`account on change: ${accountId}`);
    props.newTransactionsUpdate({}, accountId);
  };

  const accountInfoRequest = (event) => {
    // add info
    props.accountInfoRequest(props.targetAccount._id);
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
    // Check input validity
    if (inputName === NewTransaction.transId.key) {
      updates.error = validator.isAlphanumeric(content) ? '' : 'Format!';
    } else if (inputName === NewTransaction.symbol.key || inputName === NewTransaction.quantity.key) {
      console.log(content, typeof content);
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

  const newTransactionsTableRowOnCheck = (event, isInputChecked: boolean) => {
    // First table is TableHeader. Second table is TableBody
    if ($(event.target).closest('table').closest('div').index() === 0) {
      // TODO: Implement check all method
      console.log(isInputChecked, $(event.target).parents());
    } else {
      const row = $(event.target).closest('tr').index();
      updateNewTransactions(row, NewTransaction.select.key, isInputChecked);
    }
  };

  const newTransactionInputOnChange = (event, text) => {
    const row = $(event.target).closest('tr').index();
    const inputName = $(event.target).attr('name');
    updateNewTransactions(row, inputName, text);
  };

  const newTransactionTypeOnChange = (event, index, payload) => {
    console.log(index, payload);
    $('form[name="newTransactions"] table:eq(1)')
      .find('tr')
      .eq(payload.row)
      .find('#type div div:eq(1)')
      .text(payload.value);
    updateNewTransactions(payload.row, NewTransaction.action.key, payload.value);
  };

  const newTransactionSubmitOnClick = (event) => {
    event.preventDefault();
    // http://stackoverflow.com/questions/38750705/using-es6-to-filter-object-properties
    const allTrans: { [key: string]: GCNewTransactionInputType } = props.newTransactions;
    const selectedTransactions = Object.keys(allTrans)
      .filter(key => allTrans[key].select.value === true)
      .reduce((obj, key) => {
        const singleTrans: GCNewTransactionInputType = allTrans[key];
        const simplified: GCTransactionType = (Object.keys(singleTrans): string[])
          .reduce((transItem, transKey): GCTransactionType => {
            let value = singleTrans[transKey].value;
            if (transKey === NewTransaction.symbol.key) {
              value = GCUtil.getFixedSymbol(value);
            }
            transItem[transKey] = isNaN(value) || transKey === NewTransaction.transId.key || transKey === NewTransaction.note.key
                                  ? value
                                  : Number(value);
            return transItem;
          }, GCTransaction.default());
        obj[key] = new GCTransaction(simplified);
        return obj;
      }, {});
    console.log('selectedTransactions', selectedTransactions);
    if (Object.keys(selectedTransactions).length !== 0) {
      let errorMessage = '';
      const passSanityCheck = Object.keys(selectedTransactions)
        .reduce((isValid, key) => {
          const validation = selectedTransactions[key].validate();
          if (validation.error) {
            errorMessage += JSON.stringify(validation.error.details);
            return false;
          }
          return isValid;
        }, true);
      if (passSanityCheck) {
        const simplified = Object.keys(selectedTransactions).map(key => selectedTransactions[key].simple());
        props.newTransactionsSubmit(simplified, props.targetAccount._id);
      } else {
        sweetAlert('Oops...', errorMessage, 'error');
      }
    } else {
      sweetAlert('Oops...', 'You need to select something!', 'error');
    }
  };

  return (
    <div>
      <GCNewTransactionsTable
        // data
        newTransactions={props.newTransactions}
        // function
        toggleSection={toggleSection}
        accountInfoRequest={accountInfoRequest}
        newTransactionsUpdateAccount={newTransactionsUpdateAccount}
        newTransactionsAddEmptyRow={newTransactionsAddEmptyRow}
        newTransactionSubmitOnClick={newTransactionSubmitOnClick}
        newTransactionsTableRowOnCheck={newTransactionsTableRowOnCheck}
        newTransactionTypeOnChange={newTransactionTypeOnChange}
        newTransactionInputOnChange={newTransactionInputOnChange}
        updateNewTransactions={updateNewTransactions}
      />
      <h2>Next</h2>
    </div>
  );
};

AccountAdmin.propTypes = {
  // Injected by React Redux
  targetAccount: PropTypes.object.isRequired,
  accountInfoRequest: PropTypes.func.isRequired,
  newTransactions: PropTypes.object.isRequired,
  newTransactionsUpdate: PropTypes.func.isRequired,
  newTransactionsSubmit: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    targetAccount: state.account.admin.targetAccount,
    newTransactions: state.account.admin.newTransactions,
  };
};
const mapDispatchToProps = {
  accountInfoRequest: Actions.account.admin.targetAccount.request,
  newTransactionsUpdate: Actions.account.admin.newTransactions.update,
  newTransactionsSubmit: Actions.account.admin.newTransactions.submit,
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountAdmin);
export {
  DEFAULT_STATE,
};
