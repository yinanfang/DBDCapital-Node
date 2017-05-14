// @flow

import React, { PropTypes } from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Immutable from 'seamless-immutable';
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

const initStep = (): GCStepperInputType => {
  const content = {};
  content[0] = {
    title: 'Step title 0',
    descriptiton: 'Step descriptiton 0',
  };
  content[1] = {
    title: 'Step title 1',
    descriptiton: 'Step descriptiton 1',
  };
  content[2] = {
    title: 'Step title 2',
    descriptiton: 'Step descriptiton 2',
  };
  return Immutable({
    index: 0,
    maxCount: Object.keys(content).length,
    isRequesting: false,
    content,
  });
};
const DEFAULT_STATE_STEP: GCStepperInputType = _cloneDeep(initStep());

const GCStepper = (props: {
  step: GCStepperInputType,
  stepIndexIncrement: () => void,
  stepIndexDecrement: () => void,
  children: any
}) => {
  return (
    <div
      style={{
        overflow: 'auto', // clearFix for material-ui Button
      }}
    >
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
      <div className={styleCSS.floatRight}>
        <FlatButton
          label="Back"
          disabled={props.step.index === props.step.maxCount}
          onTouchTap={props.stepIndexDecrement}
          style={{ marginRight: 12 }}
        />
        <RaisedButton
          label={props.step.index === 2 ? 'Finish' : 'Next'}
          primary
          onTouchTap={props.stepIndexIncrement}
        />
      </div>
    </div>
  );
};

GCStepper.propTypes = {
  // Injected by React Redux
  children: PropTypes.node.isRequired, // eslint-disable-line react/require-default-props
  // Injected by React Redux
  stepIndexIncrement: PropTypes.func.isRequired,
  stepIndexDecrement: PropTypes.func.isRequired,
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default GCStepper;
export {
  DEFAULT_STATE_STEP,
};
