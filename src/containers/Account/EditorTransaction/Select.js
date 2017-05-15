// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
// import Paper from 'material-ui/Paper';
// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton';

// import GCUtil from '../../../utils';
// import GCStepper from '../../../components/GCStepper';
import type { GCAccountType } from '../../../../model/GCAccount';
import Actions from '../../../actions';
// import styleCSS from '../../style.css';

const DEFAULT_STATE: {
  allAccounts: {
    [key: string]: GCAccountType
  }
} = {
  allAccounts: {}, // {num: GCAccount, ...}
};

const EditorTransactionSelect = ({
  step,
  allAccounts,
  allAccountsRequest,
}: {
  step: { [key: string]: any },
  allAccounts: { [key: string]: GCAccountType },
  allAccountsRequest: () => void
}) => {
  const pullAllAccountInfo = (): void => {
    if (Object.keys(allAccounts).length === 0) {
      console.log('pulling all account basic info!');
      allAccountsRequest();
    }
  };

  const getChoices = (): [{ text: string, value: string }] => {
    const choices = Object.keys(allAccounts).map((accountId) => {
      const account: GCAccountType = allAccounts[accountId];
      return {
        text: `${account.owner.lastName}, ${account.owner.firstName} - ${account.name} (${account._id})`,
        value: accountId,
      };
    });
    console.log('getChoices', choices);
    return choices;
  };

  const handleSelect = (selected: string, index: number): void => {
    // -1 means enter is pressed in the TextField
    if (index !== -1) {
      console.log('selected: ', selected);
    }
  };

  return (
    <div>
      {pullAllAccountInfo()}
      <AutoComplete
        floatingLabelText="Select an account"
        hintText="Type to search"
        filter={AutoComplete.fuzzyFilter}
        openOnFocus
        fullWidth
        dataSource={getChoices()}
        onNewRequest={handleSelect}
        maxSearchResults={10}
      />
    </div>
  );
};

EditorTransactionSelect.propTypes = {
  // Injected by React Router
  // TODO: mark this as required
  children: PropTypes.node, // eslint-disable-line react/require-default-props
  // States Injected by React Redux
  step: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  allAccounts: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  allAccountsRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    step: state.account.admin.editorTransaction.step,
    allAccounts: state.account.admin.editorTransaction.select.allAccounts,
  };
};
const mapDispatchToProps = {
  allAccountsRequest: Actions.account.multi.allAccounts.request,
  // newTransactionsUpdate: Actions.account.admin.newTransactions.update,
  // newTransactionsSubmit: Actions.account.admin.newTransactions.submit,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditorTransactionSelect);
export {
  DEFAULT_STATE,
};
