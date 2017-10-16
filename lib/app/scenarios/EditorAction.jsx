const classNames = require('classnames');
const DeleteIcon = require('react-feather/dist/icons/trash-2').default;
const PropTypes = require('prop-types');
const React = require('react');
const SortDownIcon = require('react-feather/dist/icons/arrow-down').default;
const SortUpIcon = require('react-feather/dist/icons/arrow-up').default;

const propTypes = {
  disableSortDown: PropTypes.bool.isRequired,
  disableSortUp: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  importance: PropTypes.string.isRequired,
  moveDown: PropTypes.func.isRequired,
  moveUp: PropTypes.func.isRequired,
  outcome: PropTypes.oneOf(['max', 'high', 'medium', 'low', 'min']),
  remove: PropTypes.func.isRequired,
  setImportance: PropTypes.func.isRequired,
  setOutcome: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

const defaultProps = {
  outcome: 'medium'
};

class ScenarioAction extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChangeImportance = this.onChangeImportance.bind(this);
    this.onChangeOutcome = this.onChangeOutcome.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
  }

  onChangeImportance(e) {
    const actionId = this.props.id;
    const setImportance = this.props.setImportance;

    setImportance(actionId, e.target.value);
  }

  onChangeOutcome(e) {
    const actionId = this.props.id;
    const setOutcome = this.props.setOutcome;

    setOutcome(actionId, e.target.value);
  }

  onChangeTitle(e) {
    const actionId = this.props.id;
    const setTitle = this.props.setTitle;

    setTitle(actionId, e.target.value);
  }

  render() {
    const actionId = this.props.id;
    const disableSortDown = this.props.disableSortDown;
    const disableSortUp = this.props.disableSortUp;
    const importance = this.props.importance;
    const title = this.props.title;
    const outcome = this.props.outcome;

    const fieldClassNames = classNames([
      'b--silver',
      'ba',
      'bg-transparent',
      'border-box',
      'input-reset',
      'pa2',
      'w-100'
    ]);

    const sortDownClassNames = classNames([
      'dib',
      'hover-black',
      'pointer',
      'silver',
      'w-100',
      { hide: disableSortDown }
    ]);

    const sortUpClassNames = classNames([
      'dib',
      'hover-black',
      'pointer',
      'silver',
      'w-100',
      { hide: disableSortUp }
    ]);

    return (
      <div className="dt-row w-100">
        <div className="dtc pr2 v-mid w-05">
          <SortUpIcon
            className={sortUpClassNames}
            onClick={() => this.props.moveUp(actionId)}
            size={16}
          />
          <SortDownIcon
            className={sortDownClassNames}
            onClick={() => this.props.moveDown(actionId)}
            size={16}
          />
        </div>
        <div className="dtc pr2 pv2 v-mid w-50">
          <input
            className={fieldClassNames}
            onChange={this.onChangeTitle}
            type="text"
            value={title}
          />
        </div>
        <div className="dtc pr2 v-mid w-20">
          <select
            className="ph2 pv1 w-100"
            onChange={this.onChangeImportance}
            value={importance}
          >
            <option value="high">High</option>
            <option value="medium">Neutral</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="dtc pr2 v-mid w-20">
          <select
            className="ph2 pv1 w-100"
            onChange={this.onChangeOutcome}
            value={outcome}
          >
            <option value="max">Very High</option>
            <option value="high">High</option>
            <option value="medium">Neutral</option>
            <option value="low">Low</option>
            <option value="min">Very Low</option>
          </select>
        </div>
        <div className="dtc v-mid w-05">
          <DeleteIcon
            className="dib hover-red pointer silver w-100"
            onClick={() => this.props.remove(actionId)}
            size={16}
          />
        </div>
      </div>
    );
  }
}

ScenarioAction.defaultProps = defaultProps;
ScenarioAction.propTypes = propTypes;

module.exports = ScenarioAction;
