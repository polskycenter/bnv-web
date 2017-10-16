const PropTypes = require('prop-types');
const React = require('react');

const navigate = require('../common/router/actions').navigate;
const routes = require('../common/router/routes');

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

class ListItem extends React.PureComponent {
  render() {
    const email = this.props.email;
    const id = this.props.id;
    const name = this.props.name;

    const href = routes.account.build({ id });

    return (
      <li className="account-list-item bb b--near-white hover-bg-light-gray">
        <a
          className="dark-gray db no-underline ph2 pv3"
          href={href}
          onClick={(e) => { e.preventDefault(); navigate(href, {}, { title: name }); }}
        >
          <span>{name}</span><span className="pl2 silver">({email})</span>
        </a>
      </li>
    );
  }
}

ListItem.propTypes = propTypes;

module.exports = ListItem;
