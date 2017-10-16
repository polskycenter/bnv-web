const PropTypes = require('prop-types');
const React = require('react');

const propTypes = {
  id: PropTypes.string.isRequired,
  outcome: PropTypes.oneOf(['max', 'high', 'medium', 'low', 'min']),
  title: PropTypes.string.isRequired,
  setOutcome: PropTypes.func.isRequired
};

const defaultProps = {
  outcome: 'medium'
};

class ScenarioAction extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChangeSelectedOption = this.onChangeSelectedOption.bind(this);
  }

  onChangeSelectedOption(e) {
    const actionId = this.props.id;
    const setOutcome = this.props.setOutcome;

    setOutcome(actionId, e.target.value);
  }

  render() {
    const title = this.props.title;
    const outcome = this.props.outcome;

    return (
      <div className="scenario-action dt dt--fixed w-100">
        <div className="dt-row hover-bg-light-gray">
          <div className="scenario-action__description bb b--near-white dtc ph2 pt2 pv2 w-75">
            {title}
          </div>
          <div className="scenario-action__outcome bb b--near-white dtc ph2 pt2 pv2 w-25">
            <select
              className="ph2 pv1 w-100"
              value={outcome}
              onChange={this.onChangeSelectedOption}
            >
              <option value="max">Very High</option>
              <option value="high">High</option>
              <option value="medium">Neutral</option>
              <option value="low">Low</option>
              <option value="min">Very Low</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

ScenarioAction.defaultProps = defaultProps;
ScenarioAction.propTypes = propTypes;

module.exports = ScenarioAction;
