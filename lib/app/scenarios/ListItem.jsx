const PropTypes = require('prop-types');
const React = require('react');

const navigate = require('../common/router/actions').navigate;
const routes = require('../common/router/routes');

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

class ListItem extends React.PureComponent {
  render() {
    const id = this.props.id;
    const title = this.props.title;

    const href = routes.scenario.build({ id });

    return (
      <li className="scenario-list-item bb b--near-white hover-bg-light-gray">
        <a
          className="dark-gray db no-underline ph2 pv3"
          href={href}
          onClick={(e) => { e.preventDefault(); navigate(href, {}, { title }); }}
        >
          {title}
        </a>
      </li>
    );
  }
}

ListItem.propTypes = propTypes;

module.exports = ListItem;
