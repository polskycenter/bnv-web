const PropTypes = require('prop-types');
const React = require('react');
const SettingsIcon = require('react-feather/dist/icons/settings').default;
const WarningIcon = require('react-feather/dist/icons/slash').default;

const Action = require('./ScenarioAction.jsx');
const Editor = require('./Editor.jsx');
// const Gauge = require('./Gauge.ORIG.jsx').SemiCircle;
const Gauge = require('./Gauge.jsx');
const scoringEngines = require('./scoringEngines');

const GAUGE_OPTIONS = {
  strokeWidth: 16,
  color: '#357edd',
  trailColor: '#eaeaea',
  trailWidth: 6,
  easing: 'easeInOut',
  duration: 1000,
  svgStyle: null,
  text: {
    className: 'f1',
    value: ''
  },
  from: { color: '#e7040f' },
  to: { color: '#137752' },
  step: (state, bar) => {
    const value = Math.round(bar.value() * 100);

    let color = '#357edd';

    if (value <= 30) {
      color = '#e7040f';
    } else if (value >= 70) {
      color = '#137752';
    }

    bar.path.setAttribute('stroke', color);

    if (value === 0) {
      bar.setText('');
    } else {
      bar.setText(`${value}%`);
    }

    bar.text.style.color = color; // eslint-disable-line no-param-reassign
  }
};

const propTypes = {
  isBuilder: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  engine: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    importance: PropTypes.string.isRequired
  })).isRequired,
  prior: PropTypes.number.isRequired,
  evidenceLevels: PropTypes.shape({
    min: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  importanceWeights: PropTypes.shape({
    low: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired
  }).isRequired
};

class Scenario extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      outcomes: {}
    };

    this.onClickEditStart = this.onClickEditStart.bind(this);
    this.onClickEditStop = this.onClickEditStop.bind(this);
    this.setOutcome = this.setOutcome.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      outcomes: {},
    });
  }

  onClickEditStart() {
    this.setState({ isEditing: true });
  }

  onClickEditStop() {
    this.setState({ isEditing: false });
  }

  setOutcome(actionId, outcome) {
    const outcomes = Object.assign({}, this.state.outcomes);

    outcomes[actionId] = outcome;

    this.setState({ outcomes });
  }

  render() {
    const actions = this.props.actions;
    const engine = this.props.engine;
    const isBuilder = this.props.isBuilder;
    const isEditing = this.state.isEditing;
    const outcomes = this.state.outcomes;
    const title = this.props.title;

    let bodyEl;

    if (isEditing) {
      bodyEl = (
        <Editor stopEditing={this.onClickEditStop} {...this.props} />
      );
    } else if (!scoringEngines[engine]) {
      bodyEl = (
        <div className="pt5 red">
          <div className="tc">
            <WarningIcon size={64} />
          </div>
          <p className="center ma0 measure pt3 red tc">
            This calculator requires a scoring engine that is not currently available.
            Please choose a different calculator.
          </p>
        </div>
      );
    } else {
      bodyEl = (
        <div>
          <h1 className="f2 lh-title ma0 pb4 truncate w-100">
            {title}
            {
              isBuilder ? (
                <button
                  className="bg-transparent bn fr hover-blue light-silver outline-0 pointer"
                  onClick={this.onClickEditStart}
                >
                  <SettingsIcon />
                </button>
              ) : null
            }
          </h1>
          <Gauge
            progress={scoringEngines[engine](this.props, outcomes)}
            initialAnimate={false}
            containerClassName={'scenario-gauge center mw6'}
            options={GAUGE_OPTIONS}
          />
          <div className="ba b--near-white bg-white br1 mt4 shadow-4">
            {actions.map(action => (
              <Action
                key={action.id}
                {...action}
                outcome={outcomes[action.id]}
                setOutcome={this.setOutcome}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="scenario">
        <div className="center mv4 w-80">
          {bodyEl}
        </div>
      </div>
    );
  }
}

Scenario.propTypes = propTypes;

module.exports = Scenario;
