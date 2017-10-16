const PropTypes = require('prop-types');
const React = require('react');
const values = require('object.values');
const WarningIcon = require('react-feather/dist/icons/slash').default;

const actions = require('./actions');
const Editor = require('./Editor.jsx');
const List = require('./List.jsx');
const LoadingCube = require('../common/LoadingCube.jsx');
const Scenario = require('./Scenario.jsx');
const store = require('./store');
const stub = require('./stub');

const propTypes = {
  isBuilder: PropTypes.bool.isRequired,
  scenarioId: PropTypes.string
};

const defaultProps = {
  scenarioId: null
};

class Scenarios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreating: false,
      isEditing: false,
      scenarios: store.getAll()
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

  formatScenariosForList() {
    return values(this.state.scenarios)
      .map(scenario => ({ id: scenario.id, title: scenario.title }))
      .sort(store.compareByTitle);
  }

  syncStoreState() {
    this.setState({
      scenarios: store.getAll()
    });
  }

  render() {
    const isCreating = this.state.isCreating;
    const isBuilder = this.props.isBuilder;
    const scenarioId = this.props.scenarioId;

    const scenarios = this.formatScenariosForList();

    const scenario = scenarioId ? this.state.scenarios[scenarioId] : null;

    let component;

    if (isCreating) {
      component = (
        <div className="center mv4 w-80">
          <Editor stopEditing={this.onClickCreateStop} {...stub()} />
        </div>
      );
    } else if (scenario) {
      component = (
        <Scenario {...scenario} isBuilder={isBuilder} />
      );
    } else if (scenarioId && scenarios.length) {
      component = (
        <div className="scenarios__detail__loading pt5 red">
          <div className="scenarios__detail__error__icon tc">
            <WarningIcon size={64} />
          </div>
          <p className="center ma0 measure pt3 red tc">
            This scenario does not exist or was removed.
            Please choose a different account.
          </p>
        </div>
      );
    } else if (scenarios.length) {
      component = (
        <List
          isBuilder={isBuilder}
          launchScenarioCreate={this.onClickCreateStart}
          scenarios={scenarios}
        />
      );
    } else {
      component = (
        <div className="scenarios__detail__loading pt5">
          <div className="scenarios__detail__loading__icon"><LoadingCube /></div>
          <p className="dark-pink ma0 pt3 tc">One moment please...</p>
        </div>
      );
    }

    return component;
  }
}

Scenarios.defaultProps = defaultProps;
Scenarios.propTypes = propTypes;

module.exports = Scenarios;
