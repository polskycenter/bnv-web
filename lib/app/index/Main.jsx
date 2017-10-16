const PropTypes = require('prop-types');
const React = require('react');
const WarningIcon = require('react-feather/dist/icons/slash').default;

const Accounts = require('../accounts/Main.jsx');
const Banner = require('./Banner.jsx');
const routes = require('../common/router/routes');
const Scenarios = require('../scenarios/Main.jsx');
const store = require('../common/router/store');

const propTypes = {
  isBuilder: PropTypes.bool.isRequired,
  isManager: PropTypes.bool.isRequired
};

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getAll();

    this.syncStoreState = this.syncStoreState.bind(this);
  }

  componentDidMount() {
    store.on('change', this.syncStoreState);
  }

  componentWillUnmount() {
    store.off('change', this.syncStoreState);
  }

  syncStoreState() {
    this.setState(store.getAll());
  }

  render() {
    const isBuilder = this.props.isBuilder;
    const isManager = this.props.isManager;
    const path = this.state.path;

    const accountParams = routes.account.test(path);
    const scenarioParams = routes.scenario.test(path);

    let bodyElement;

    if (routes.scenarios.test(path)) {
      bodyElement = (
        <Scenarios isBuilder={isBuilder} />
      );
    } else if (scenarioParams) {
      bodyElement = (
        <Scenarios isBuilder={isBuilder} scenarioId={scenarioParams.id} />
      );
    } else if (isManager && routes.accounts.test(path)) {
      bodyElement = (
        <Accounts />
      );
    } else if (isManager && accountParams) {
      bodyElement = (
        <Accounts accountId={accountParams.id} />
      );
    } else {
      bodyElement = (
        <div className="index__not_found pt5 red">
          <div className="scenarios__detail__error__icon tc">
            <WarningIcon size={64} />
          </div>
          <p className="center ma0 measure pt3 red tc">
            The requested page does not exist, was removed, or is not available for your account.
          </p>
        </div>
      );
    }

    return (
      <div className="index dark-gray dt dt--fixed h-100 w-100">
        <div className="index__banner dt-row">
          <div className="dtc h3">
            <Banner isManager={isManager} path={this.state.path} />
          </div>
        </div>
        <div className="index__body bg-near-white dt-row">
          <div className="dtc relative">
            <div className="drop-shadow z-1" />
            <div className="absolute bottom-0 left-0 right-0 top-0">
              <div className="h-100 overflow-y-auto w-100">
                {bodyElement}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = propTypes;

module.exports = Main;
