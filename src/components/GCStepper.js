// @flow

import React, { PropTypes } from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import _cloneDeep from 'lodash/cloneDeep';

import styleCSS from '../style.css';

export type GCStepperInputType = {
  index: number,
  maxCount: number,
  isRequesting: boolean,
  content: {
    [key: number]: {
      title: string,
      descriptiton: string
    }
  }
};

const DEFAULT_STEP_COUNT = 3;
const initStep = (count: number = DEFAULT_STEP_COUNT): GCStepperInputType => {
  const content = {};
  [...Array(count)].map((_, i) => {
    content[i] = {
      title: `Step title ${i}`,
      descriptiton: `Step description ${i}`,
    };
    return '';
  });
  return _cloneDeep({
    index: 0,
    maxCount: Object.keys(content).length,
    isRequesting: false,
    content,
  });
};
const DEFAULT_STATE_STEP: GCStepperInputType = initStep();

const Frame = (props: {
  step: GCStepperInputType,
  children: any
}) => {
  return (
    <div>
      <Stepper activeStep={props.step.index} style={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
        {[...Array(props.step.maxCount)].map((_, i) => {
          return (
            <Step
              key={i} // eslint-disable-line react/no-array-index-key
            >
              <StepLabel>{props.step.content[i].title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {props.children}
      </div>
    </div>
  );
};

Frame.propTypes = {
  // Injected by React Redux
  children: PropTypes.node.isRequired, // eslint-disable-line react/require-default-props
  // Injected by React Redux
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const Footer = (props: {
  step: GCStepperInputType,
  stepIndexIncrement: () => void,
  stepIndexDecrement: () => void,
  children: any
}) => {
  const handleRestart = () => {
    console.log('restart this');
  };
  return (
    <div
      style={{
        overflow: 'auto', // clearFix for float right element
      }}
    >
      { props.step.index === props.step.maxCount ?
        <RaisedButton
          className={styleCSS.floatRight}
          label="Restart"
          onTouchTap={handleRestart}
          primary
          style={{ marginRight: 12 }}
        />
        : ''
      }
      <RaisedButton
        className={styleCSS.floatRight}
        label="Back"
        disabled={props.step.index === 0 || props.step.index === props.step.maxCount}
        onTouchTap={props.stepIndexDecrement}
        style={{ marginRight: 12 }}
      />
      <RaisedButton
        className={styleCSS.floatRight}
        label="Next"
        disabled={props.step.index === props.step.maxCount}
        primary
        onTouchTap={props.stepIndexIncrement}
      />
    </div>
  );
};

Footer.propTypes = {
  // Injected by React Redux
  children: PropTypes.node.isRequired, // eslint-disable-line react/require-default-props
  // Injected by React Redux
  stepIndexIncrement: PropTypes.func.isRequired,
  stepIndexDecrement: PropTypes.func.isRequired,
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default { Frame, Footer };
export {
  initStep,
  DEFAULT_STATE_STEP,
};
