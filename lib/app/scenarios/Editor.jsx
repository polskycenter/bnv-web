const AddIcon = require('react-feather/dist/icons/plus-circle').default;
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const Action = require('./EditorAction.jsx');
const clone = require('../common/clone');
const constants = require('./constants');
const fluxActions = require('./actions');
const navigate = require('../common/router/actions').navigate;
const routes = require('../common/router/routes');
const scoringEngines = require('./scoringEngines');

const PREFIX = constants.TEMPORARY_ID_PREFIX;

function applySortOrder(action, idx) {
  return Object.assign({}, action, { sortOrder: idx });
}

function findActionIndex(actions, actionId) {
  return actions.reduce((out, action, i) => {
    if (action.id === actionId) {
      return i;
    }

    return out;
  }, -1);
}

const propTypes = {
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
  }).isRequired,
  stopEditing: PropTypes.func.isRequired
};

class Editor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      isSaving: false,
      engine: props.engine,
      title: props.title,
      actions: clone(props.actions),
      outcomes: {},
      prior: props.prior,
      evidenceLevels: clone(props.evidenceLevels),
      importanceWeights: clone(props.importanceWeights)
    };

    this.moveActionDown = this.moveActionDown.bind(this);
    this.moveActionUp = this.moveActionUp.bind(this);
    this.onChangeActionImportance = this.onChangeActionImportance.bind(this);
    this.onChangeActionTitle = this.onChangeActionTitle.bind(this);
    this.onChangeEvidenceLevel = this.onChangeEvidenceLevel.bind(this);
    this.onChangeImportanceWeight = this.onChangeImportanceWeight.bind(this);
    this.onChangePrior = this.onChangePrior.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onClickAddAction = this.onClickAddAction.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.removeAction = this.removeAction.bind(this);
    this.setAllOutcomes = this.setAllOutcomes.bind(this);
    this.setOutcome = this.setOutcome.bind(this);
  }

  onClickAddAction() {
    const actions = this.state.actions.slice(0);
    const scenarioId = this.props.id;

    actions.push({
      id: `${PREFIX}_${Date.now().toString(36)}`,
      description: null,
      importance: 'medium',
      scenarioId,
      title: ''
    });

    this.setState({ actions: actions.map(applySortOrder) });
  }

  onClickCancel() {
    const stopEditing = this.props.stopEditing;

    return stopEditing();
  }

  onClickDelete() {
    const isConfirmed = global.confirm('Permanently delete this calculator?');

    if (isConfirmed) {
      fluxActions.delete(this.props.id);

      navigate(routes.scenarios.build());
    }
  }

  onClickSave() {
    const stopEditing = this.props.stopEditing;

    this.setState({ isSaving: true });

    fluxActions.resolve(this.props, this.state, () => stopEditing());
  }

  onChangePrior(e) {
    this.setState({
      prior: parseFloat(e.target.value)
    });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeActionImportance(actionId, importance) {
    const actions = this.state.actions;

    this.setState({
      actions: actions.map((action) => {
        if (action.id === actionId) {
          return Object.assign({}, action, { importance });
        }

        return action;
      })
    });
  }

  onChangeActionTitle(actionId, title) {
    const actions = this.state.actions;

    this.setState({
      actions: actions.map((action) => {
        if (action.id === actionId) {
          return Object.assign({}, action, { title });
        }

        return action;
      })
    });
  }

  onChangeImportanceWeight(importance, e) {
    const importanceWeights = Object.assign({}, this.state.importanceWeights);

    importanceWeights[importance] = parseFloat(e.target.value);

    this.setState({ importanceWeights });
  }

  onChangeEvidenceLevel(level, e) {
    const evidenceLevels = Object.assign({}, this.state.evidenceLevels);

    evidenceLevels[level] = parseFloat(e.target.value);

    this.setState({ evidenceLevels });
  }

  setOutcome(actionId, outcome) {
    const outcomes = Object.assign({}, this.state.outcomes);

    outcomes[actionId] = outcome;

    this.setState({ outcomes });
  }

  setAllOutcomes(level) {
    const levels = Object.keys(this.state.evidenceLevels);

    const outcomes = this.state.actions.reduce((out, action) => {
      out[action.id] = level === 'random' ? levels[Math.floor(Math.random() * levels.length)] : level; // eslint-disable-line max-len, no-param-reassign

      return out;
    }, {});

    this.setState({ outcomes });
  }

  moveActionUp(actionId) {
    const actions = this.state.actions.slice(0);

    const idx = findActionIndex(actions, actionId);

    if (idx > 0) {
      const displacedAction = actions[idx - 1];

      actions[idx - 1] = actions[idx];
      actions[idx] = displacedAction;

      this.setState({ actions: actions.map(applySortOrder) });
    }
  }

  moveActionDown(actionId) {
    const actions = this.state.actions.slice(0);

    const idx = findActionIndex(actions, actionId);

    if (idx > -1 && idx < actions.length - 1) {
      const displacedAction = actions[idx + 1];

      actions[idx + 1] = actions[idx];
      actions[idx] = displacedAction;

      this.setState({ actions: actions.map(applySortOrder) });
    }
  }

  removeAction(actionId) {
    const actions = this.state.actions.slice(0).filter(action => action.id !== actionId);

    this.setState({ actions: actions.map(applySortOrder) });
  }

  render() {
    const actions = this.state.actions;
    const engine = this.state.engine;
    const evidenceLevels = this.state.evidenceLevels;
    const importanceWeights = this.state.importanceWeights;
    const isSaving = this.state.isSaving;
    const outcomes = this.state.outcomes;
    const prior = this.state.prior;
    const scenarioId = this.props.id;
    const title = this.state.title;

    const posterior = scoringEngines[engine] ? scoringEngines[engine](this.state, outcomes) : -1;

    const buttonClassNames = classNames([
      'b--silver',
      'ba',
      'bg-transparent',
      'gray',
      'hover-black',
      'input-reset',
      'ml2',
      'ph2',
      'pointer',
      'pv1'
    ]);

    const fieldClassNames = classNames([
      'b--silver',
      'ba',
      'bg-transparent',
      'border-box',
      'input-reset',
      'mb1',
      'pa2',
      'w-100'
    ]);

    const labelClassNames = classNames([
      'db',
      'f6',
      'fw6',
      'lh-copy'
    ]);

    return (
      <div className="scenario-edit ba b--near-white bg-white br1 shadow-4 pv4 ph5">
        <div className="dt dt-fixed mb4 w-100">
          <div className="dtc f2 v-mid w-50">
            <strong>Score:</strong> {
              posterior === -1 ?
                (<span className="red">n/a</span>) :
                (<span> {100 * posterior}%</span>)
            }
          </div>
          <div className="dtc v-mid w-50">
            <div className="dib fr">
              <button className={buttonClassNames} onClick={() => this.setAllOutcomes('min')}>
                Minimum
              </button>
              <button className={buttonClassNames} onClick={() => this.setAllOutcomes('medium')}>
                Neutral
              </button>
              <button className={buttonClassNames} onClick={() => this.setAllOutcomes('max')}>
                Maximum
              </button>
              <button className={buttonClassNames} onClick={() => this.setAllOutcomes('random')}>
                Random
              </button>
            </div>
          </div>
        </div>

        <div className="dt dt-fixed mb4 w-100">
          <div className="dtc pr2 w-75">
            <label className={labelClassNames} htmlFor="scenario-title">Title</label>
            <input
              className={fieldClassNames}
              id="scenario-title"
              onChange={this.onChangeTitle}
              value={title}
            />
          </div>
          <div className="dtc pl2 w-25">
            <label className={labelClassNames} htmlFor="scenario-prior">
              Prior
              <span className="normal black-60 pl2">(0.0 &ndash; 1.0)</span>
            </label>
            <input
              className={fieldClassNames}
              id="scenario-prior"
              onChange={this.onChangePrior}
              type="number"
              value={prior}
            />
          </div>
        </div>

        <p className="ma0 pb2 f4">
          Evidence levels
          <span className="f6 normal black-60 pl2">(0.0 &ndash; 1.0)</span>
        </p>
        <div className="dt dt-fixed mb4 w-100">
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="evidence-min">Very low</label>
            <input
              className={fieldClassNames}
              id="evidence-min"
              onChange={e => this.onChangeEvidenceLevel('min', e)}
              type="number"
              value={evidenceLevels.min}
            />
          </div>
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="evidence-low">Low</label>
            <input
              className={fieldClassNames}
              id="evidence-low"
              onChange={e => this.onChangeEvidenceLevel('low', e)}
              type="number"
              value={evidenceLevels.low}
            />
          </div>
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="evidence-medium">Neutral</label>
            <input
              className={fieldClassNames}
              id="evidence-medium"
              onChange={e => this.onChangeEvidenceLevel('medium', e)}
              type="number"
              value={evidenceLevels.medium}
            />
          </div>
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="evidence-high">High</label>
            <input
              className={fieldClassNames}
              id="evidence-high"
              onChange={e => this.onChangeEvidenceLevel('high', e)}
              type="number"
              value={evidenceLevels.high}
            />
          </div>
          <div className="dtc w-20">
            <label className={labelClassNames} htmlFor="evidence-max">Very high</label>
            <input
              className={fieldClassNames}
              id="evidence-max"
              onChange={e => this.onChangeEvidenceLevel('max', e)}
              type="number"
              value={evidenceLevels.max}
            />
          </div>
        </div>

        <p className="ma0 pb2 f4">
          Importance weights
          <span className="f6 normal black-60 pl2">
            (0 &ndash; 1 to underweight, 1 to even weight, 1+ to overweight)
          </span>
        </p>
        <div className="dt dt-fixed mb4 w-100">
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="importance-low">Low</label>
            <input
              className={fieldClassNames}
              id="importance-low"
              onChange={e => this.onChangeImportanceWeight('low', e)}
              type="number"
              value={importanceWeights.low}
            />
          </div>
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="importance-medium">Neutral</label>
            <input
              className={fieldClassNames}
              id="importance-medium"
              onChange={e => this.onChangeImportanceWeight('medium', e)}
              type="number"
              value={importanceWeights.medium}
            />
          </div>
          <div className="dtc pr2 w-20">
            <label className={labelClassNames} htmlFor="importance-high">High</label>
            <input
              className={fieldClassNames}
              id="importance-high"
              onChange={e => this.onChangeImportanceWeight('high', e)}
              type="number"
              value={importanceWeights.high}
            />
          </div>
          <div className="dtc pr2 w-20">
            &nbsp;
          </div>
          <div className="dtc w-20">
            &nbsp;
          </div>
        </div>

        <p className="ma0 pb2 f4">
          Actions
        </p>
        <div className="dt dt-fixed mb1 w-100">
          <div className="dt-row w-100">
            <div className="dtc pr2 tc v-mid w-05">
              <span className={labelClassNames}>Sort</span>
            </div>
            <div className="dtc pr2 v-mid w-50">
              <span className={labelClassNames}>Title</span>
            </div>
            <div className="dtc pr2 v-mid w-20">
              <span className={labelClassNames}>Importance</span>
            </div>
            <div className="dtc pr2 v-mid w-20">
              <span className={labelClassNames}>Calculate...</span>
            </div>
            <div className="dtc pr2 v-mid w-05">
              &nbsp;
            </div>
          </div>
        </div>
        <div className="dt dt-fixed mb1 w-100">
          {actions.map((action, idx) => (
            <Action
              key={action.id}
              {...action}
              disableSortDown={idx === actions.length - 1}
              disableSortUp={idx === 0}
              moveDown={this.moveActionDown}
              moveUp={this.moveActionUp}
              outcome={outcomes[action.id]}
              remove={this.removeAction}
              setImportance={this.onChangeActionImportance}
              setOutcome={this.setOutcome}
              setTitle={this.onChangeActionTitle}
            />
          ))}
        </div>
        <div className="dt dt-fixed mb5 w-100">
          <div className="dt-row w-100">
            <div className="dtc dtc v-mid w-95">
              &nbsp;
            </div>
            <div className="dtc v-mid w-05">
              <AddIcon
                className="dib hover-black pointer silver w-100"
                onClick={this.onClickAddAction}
              />
            </div>
          </div>
        </div>
        {
          isSaving ?
            (
              <div className="dt mb3 w-100">
                <div className="dtc tr v-mid">
                  <span className="scenario__saving b dark-pink dib tl">
                    <span className="threedots">&nbsp;</span>
                  </span>
                </div>
              </div>
            ) :
            (
              <div className="dt mb3 w-100">
                {
                  scenarioId.startsWith(PREFIX) ?
                    null :
                    (
                      <div className="dtc">
                        <button
                          className="bn bg-transparent f6 gray hover-red input-reset pointer"
                          onClick={this.onClickDelete}
                        >
                          Delete this calculator
                        </button>
                      </div>
                    )
                }
                <div className="dtc tr v-mid">
                  <button
                    className="bn bg-transparent f6 gray hover-blue input-reset mr4 pointer"
                    onClick={this.onClickCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="ba f5 input-reset ph3 pv2 pointer dib white bg-blue"
                    onClick={this.onClickSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

Editor.propTypes = propTypes;

module.exports = Editor;
