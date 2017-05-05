// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

// import Actions from '../../actions';
import styleCSS from '../../style.css';

const DEFAULT_STATE = {
};

const EditorTransaction = (props) => {
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

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return 'Select campaign settings...';
      case 1:
        return 'What is an ad group anyways?';
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  };

  return (
    <Paper className={styleCSS.accountSectionContainer}>
      <Stepper activeStep={state.stepIndex} style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
        <Step>
          <StepLabel>Select account & action</StepLabel>
        </Step>
        <Step>
          <StepLabel>Insert/Modify transactions</StepLabel>
        </Step>
        <Step>
          <StepLabel>Review & submit</StepLabel>
        </Step>
        <Step>
          <StepLabel>Result</StepLabel>
        </Step>
      </Stepper>
      {state.finished ? (
        <p>
          <a
            href="##"
            onClick={(event) => {
              event.preventDefault();
              state = { stepIndex: 0, finished: false };
            }}
          >
            Click here
          </a> to reset the example.
        </p>
      ) : (
        <div>
          <p>{getStepContent(state.stepIndex)}</p>
          <div className={styleCSS.floatRight}>
            <FlatButton
              label="Back"
              disabled={state.stepIndex === 0}
              onTouchTap={handlePrev}
              style={{ marginRight: 12 }}
            />
            <RaisedButton
              label={state.stepIndex === 2 ? 'Finish' : 'Next'}
              primary
              onTouchTap={handleNext}
            />
          </div>
        </div>
      )}
    </Paper>
  );
};

EditorTransaction.propTypes = {
  // Injected by React Router
  children: PropTypes.node,
  // Injected by React Redux
  // isMobileDrawer: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps, {
})(EditorTransaction);
export {
  DEFAULT_STATE,
};
