const PropTypes = require('prop-types');
const React = require('react');
const values = require('object.values');
const WarningIcon = require('react-feather/dist/icons/slash').default;

const Account = require('./Account.jsx');
const actions = require('./actions');
const List = require('./List.jsx');
const LoadingCube = require('../common/LoadingCube.jsx');
const navigate = require('../common/router/actions').navigate;
const routes = require('../common/router/routes');
const store = require('./store');
const stub = require('./stub');

const propTypes = {
  accountId: PropTypes.string
};

const defaultProps = {
  accountId: null
};

class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreating: false,
      accounts: store.getAll()
    };

    this.onClickCreateStart = this.onClickCreateStart.bind(this);
    this.onClickCreateStop = this.onClickCreateStop.bind(this);
    this.syncStoreState = this.syncStoreState.bind(this);
  }

  componentDidMount() {
    actions.sync();
    store.on('change', this.syncStoreState);
  }

  componentWillUnmount() {
    store.off('change', this.syncStoreState);
  }

  onClickCreateStart() {
    this.setState({ isCreating: true });
  }

  onClickCreateStop() {
    this.setState({ isCreating: false });
  }

  formatAccountsForList() {
    return values(this.state.accounts)
      .map(account => ({ id: account.id, name: account.name, email: account.email }))
      .sort(store.compareByName);
  }

  syncStoreState() {
    this.setState({
      accounts: store.getAll()
    });
  }

  render() {
    const isCreating = this.state.isCreating;
    const accountId = this.props.accountId;

    const accounts = this.formatAccountsForList();

    const account = accountId ? this.state.accounts[accountId] : null;

    let component;

    if (isCreating) {
      component = (
        <Account stopEditing={this.onClickCreateStop} {...stub()} />
      );
    } else if (account) {
      component = (
        <Account stopEditing={() => navigate(routes.accounts.build())} {...account} />
      );
    } else if (accountId && accounts.length) {
      component = (
        <div className="accounts__detail__loading pt5 red">
          <div className="accounts__detail__error__icon tc">
            <WarningIcon size={64} />
          </div>
          <p className="center ma0 measure pt3 red tc">
            This account does not exist or was removed.
            Please choose a different account.
          </p>
        </div>
      );
    } else if (accounts.length) {
      component = (
        <List
          launchAccountCreate={this.onClickCreateStart}
          accounts={accounts}
        />
      );
    } else {
      component = (
        <div className="accounts__detail__loading pt5">
          <div className="accounts__detail__loading__icon"><LoadingCube /></div>
          <p className="dark-pink ma0 pt3 tc">One moment please...</p>
        </div>
      );
    }

    return component;
  }
}

Accounts.defaultProps = defaultProps;
Accounts.propTypes = propTypes;

module.exports = Accounts;
