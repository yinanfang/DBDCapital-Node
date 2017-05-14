// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Paper from 'material-ui/Paper';
// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton';

// import GCUtil from '../../../utils';
// import GCStepper from '../../../components/GCStepper';
// import Actions from '../../../actions';
// import styleCSS from '../../style.css';

const DEFAULT_STATE = {
  allAccounts: {}, // {num: GCAccount, ...}
  choices: {}, // Reference key in allAccounts
};

const EditorTransactionEdit = ({
  step,
}: {
  step: { [key: string]: any }
}) => {
  const pullAllAccountInfo = (): void => {
    console.log('pulling!');
  };

  return (
    <div>
      {pullAllAccountInfo()}
      select content
    </div>
  );
};

EditorTransactionEdit.propTypes = {
  // Injected by React Router
  // TODO: mark this as required
  children: PropTypes.node, // eslint-disable-line react/require-default-props
  // States Injected by React Redux
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => {
  return {
    step: state.account.admin.editorTransaction.step,
  };
};
const mapDispatchToProps = {
  // newTransactionsUpdate: Actions.account.admin.newTransactions.update,
  // newTransactionsSubmit: Actions.account.admin.newTransactions.submit,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditorTransactionEdit);
export {
  DEFAULT_STATE,
};
