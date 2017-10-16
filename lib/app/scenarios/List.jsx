const AddIcon = require('react-feather/dist/icons/plus-circle').default;
const PropTypes = require('prop-types');
const React = require('react');

const ListItem = require('./ListItem.jsx');

const propTypes = {
  isBuilder: PropTypes.bool.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })).isRequired,
  launchScenarioCreate: PropTypes.func.isRequired
};

const defaultProps = {
  activeScenarioId: null
};

class List extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClickCreate = this.onClickCreate.bind(this);
  }

  onClickCreate(e) {
    const launchScenarioCreate = this.props.launchScenarioCreate;

    e.preventDefault();

    launchScenarioCreate();
  }

  render() {
    const isBuilder = this.props.isBuilder;
    const scenarios = this.props.scenarios;

    const listItemElements = scenarios.map(scenario => (
      <ListItem
        key={scenario.id}
        {...scenario}
      />
    ));

    return (
      <div className="scenario-list center mv4 w-80">
        <ol className="ba b--near-white bg-white br1 ma0 pa0 list shadow-4">
          {listItemElements}
        </ol>
        {
          isBuilder ? (
            <div className="pv2 tr">
              <AddIcon className="hover-blue light-silver pointer" onClick={this.onClickCreate} />
            </div>
          ) : null
        }
      </div>
    );
  }
}

List.defaultProps = defaultProps;
List.propTypes = propTypes;

module.exports = List;
