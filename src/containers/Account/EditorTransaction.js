// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Paper from 'material-ui/Paper';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

// import GCUtil from '../../../utils';
// import Actions from '../../actions';
import styleCSS from '../../style.css';

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
  allAccounts: {}, // {num: GCAccount, ...}
  targetAccount: {}, // GCAccount.default()
  newTransactions: {}, // GCTransaction.defaultInputWithCount(DEFAULT_NEW_TRANSACTIONS_COUNT)
  oldTransactions: {}, // {num: GCTransaction, ...}
  result: {},
};

const EditorTransaction = ({
  step,
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
  let state = {
    finished: false,
    stepIndex: 0,
  };

  const handleNext = () => {
    const { stepIndex } = state;
    state = {
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    };
  };

  const handlePrev = () => {
    const { stepIndex } = state;
    if (stepIndex > 0) {
      Object.assign({}, state, { stepIndex: stepIndex - 1 });
    }
  };

  const pullAllAccountInfo = (): void => {
    console.log('pulling!');
  };

  const singleStepControlButton = (stepIndex: number) => {
    return (
      <div className={styleCSS.floatRight}>
        <FlatButton
          label="Back"
          disabled={stepIndex === 0}
          onTouchTap={handlePrev}
          style={{ marginRight: 12 }}
        />
        <RaisedButton
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          primary
          onTouchTap={handleNext}
        />
      </div>
    );
  };

  const singleStepContainer = (stepIndex: number = 0) => {
    if (stepIndex === 0) { // Select
      return (
        <div>
          {pullAllAccountInfo()}
          {step.content[stepIndex].descriptiton}
          {singleStepControlButton(state.stepIndex)}
        </div>
      );
    }
    return '';
  };

  return (
    <form
      name="EditorTransaction"
      style={{
        overflow: 'auto', // clearFix for material-ui Button
      }}
    >
      <Stepper activeStep={step.index} style={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
        {[...Array(step.maxCount)].map((_, i) => {
          return (
            <Step
              key={i} // eslint-disable-line react/no-array-index-key
            >
              <StepLabel>{step.content[i].title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {singleStepContainer(step.stepIndex)}
    </form>
  );
};

EditorTransaction.propTypes = {
  // Injected by React Router
  // TODO: mark this as required
  children: PropTypes.node, // eslint-disable-line react/require-default-props
  // Injected by React Redux
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => {
  return {
    step: state.account.admin.EditorTransaction.step,
  };
};

export default connect(mapStateToProps, {
})(EditorTransaction);
export {
  DEFAULT_STATE,
};
