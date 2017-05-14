// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Paper from 'material-ui/Paper';
// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton';

// import GCUtil from '../../../utils';
import GCStepper from '../../../components/GCStepper';
import Actions from '../../../actions';
import EditorTransactionSelect, { DEFAULT_STATE as DEFAULT_STATE_SELECT } from './Select';
// import EditorTransactionEdit, { DEFAULT_STATE as DEFAULT_STATE_EDIT } from './Edit';
// import styleCSS from '../../style.css';

const initStep = () => {
  const content: { [key: number]: {[key: string]: string} } = {};
  content[0] = {
    title: 'Select account & action',
    descriptiton: 'Select account from dropdown',
  };
  content[1] = {
    title: 'Editor',
    descriptiton: 'Edit them',
  };
  content[2] = {
    title: 'Review & submit',
    descriptiton: 'Review them',
  };
  content[3] = {
    title: 'Result',
    descriptiton: 'See results!',
  };
  return {
    index: 0,
    maxCount: Object.keys(content).length,
    isRequesting: false,
    content,
  };
};
const DEFAULT_STATE = {
  step: initStep(),
  select: DEFAULT_STATE_SELECT,
  editorType: '',
  targetAccount: {}, // GCAccount.default()
  newTransactions: {}, // GCTransaction.defaultInputWithCount(DEFAULT_NEW_TRANSACTIONS_COUNT)
  oldTransactions: {}, // {num: GCTransaction, ...}
  result: {},
};

const EditorTransaction = ({
  step,

  // function
  stepIndexIncrement,
  stepIndexDecrement,


  // uiControl,
  // data
  // newTransactions,
  // function
  // toggleSection,
  // newTransactionsUpdateAccount,
  // accountInfoRequest,
  // newTransactionsAddEmptyRow,
  // newTransactionSubmitOnClick,
  // newTransactionsTableRowOnCheck,
  // newTransactionTypeOnChange,
  // newTransactionInputOnChange,
  // updateNewTransactions,
}: {
  step: { [key: string]: any },

  // function
  stepIndexIncrement: () => void,
  stepIndexDecrement: () => void


  // uiControl: {
  // }
  // data
  // newTransactions: { [key: string]: GCNewTransactionInputType },
  // function
  // toggleSection: (event: any) => void,
  // newTransactionsUpdateAccount: (event: any, text: string) => void,
  // accountInfoRequest: (event: any) => void,
  // newTransactionsAddEmptyRow: (event: any) => void,
  // newTransactionSubmitOnClick: (event: any) => void,
  // newTransactionsTableRowOnCheck: (event: any, isInputChecked: boolean) => void,
  // newTransactionTypeOnChange: (event: any, index: number, payload: any) => void,
  // newTransactionInputOnChange: (event: any, text: string) => void,
  // updateNewTransactions: (row: number, inputName: string, content: string) => void
}) => {
  const singleStepContainer = (stepIndex: number = 0) => {
    if (stepIndex === 0) { // Select
      return (
        <EditorTransactionSelect />
      );
    }
    return '';
  };

  return (
    <GCStepper
      step={step}
      stepIndexIncrement={stepIndexIncrement}
      stepIndexDecrement={stepIndexDecrement}
    >
      <form
        name="EditorTransaction"
      >
        {singleStepContainer(step.index)}
      </form>
    </GCStepper>
  );
};

EditorTransaction.propTypes = {
  // Injected by React Router
  // TODO: mark this as required
  children: PropTypes.node, // eslint-disable-line react/require-default-props
  // States Injected by React Redux
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  // Dispatches Injected by React Redux
  stepIndexIncrement: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    step: state.account.admin.editorTransaction.step,
  };
};
const mapDispatchToProps = {
  stepIndexIncrement: Actions.account.admin.editorTransaction.step.index.increment,
  stepIndexDecrement: Actions.account.admin.editorTransaction.step.index.decrement,
  // newTransactionsUpdate: Actions.account.admin.newTransactions.update,
  // newTransactionsSubmit: Actions.account.admin.newTransactions.submit,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditorTransaction);
export {
  DEFAULT_STATE,
};
