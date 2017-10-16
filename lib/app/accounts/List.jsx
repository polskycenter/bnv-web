const AddIcon = require('react-feather/dist/icons/plus-circle').default;
const PropTypes = require('prop-types');
const React = require('react');

const ListItem = require('./ListItem.jsx');

const propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  launchAccountCreate: PropTypes.func.isRequired
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
    const launchAccountCreate = this.props.launchAccountCreate;

    e.preventDefault();

    launchAccountCreate();
  }

  render() {
    const accounts = this.props.accounts;

    const listItemElements = accounts.map(account => (
      <ListItem
        key={account.id}
        {...account}
      />
    ));

    return (
      <div className="account-list center mv4 w-80">
        <ol className="ba b--near-white bg-white br1 ma0 pa0 list shadow-4">
          {listItemElements}
        </ol>
        <div className="pv2 tr">
          <AddIcon className="hover-blue light-silver pointer" onClick={this.onClickCreate} />
        </div>
      </div>
    );
  }
}

List.defaultProps = defaultProps;
List.propTypes = propTypes;

module.exports = List;
