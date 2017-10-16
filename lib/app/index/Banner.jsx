const AccountsIcon = require('react-feather/dist/icons/users').default;
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const ScenariosIcon = require('react-feather/dist/icons/play-circle').default;

const navigate = require('../common/router/actions').navigate;
const routes = require('../common/router/routes');

const propTypes = {
  isManager: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

class Banner extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      defaultLinkClassnames: [
        'banner__navigation__item',
        'b--light-gray',
        'bl',
        'dtc',
        'f5',
        'hover-blue',
        'no-underline',
        'ph3',
        'v-mid'
      ]
    };
  }

  render() {
    const defaultLinkClassnames = this.state.defaultLinkClassnames;
    const isManager = this.props.isManager;
    const path = this.props.path;

    const isAccountsActive = routes.accounts.test(path) || routes.account.test(path);
    const isScenariosActive = routes.scenarios.test(path) || routes.scenario.test(path);

    const accountsClassNames = classNames(
      defaultLinkClassnames,
      {
        'black-80': isAccountsActive,
        b: isAccountsActive,
        gray: !isAccountsActive
      }
    );

    const scenariosClassNames = classNames(
      defaultLinkClassnames,
      {
        'black-80': isScenariosActive,
        b: isScenariosActive,
        gray: !isScenariosActive
      }
    );

    return (
      <div className="banner bb b--light-silver dt dt--fixed h-100 w-100">
        <div className="dt-row">
          <div className="banner__title dtc v-mid w-50">
            <img
              alt="Building the New Venture"
              className="banner__title__icon ph3"
              src="/public/img/bnv-icon.png"
            />
          </div>
          <div className="banner__navigation dtc tr w-50">
            <div className="dt fr h-100">
              <a
                className={scenariosClassNames}
                href={routes.scenarios.build()}
                onClick={(e) => { e.preventDefault(); navigate(routes.scenarios.build()); }}
              >
                <ScenariosIcon className="v-mid pb1 pr1" size={18} />
                <span className="banner__navigation__item__text no-underline">
                  Calculators
                </span>
              </a>
              {
                isManager ?
                  (
                    <a
                      className={accountsClassNames}
                      href={routes.scenarios.build()}
                      onClick={(e) => { e.preventDefault(); navigate(routes.accounts.build()); }}
                    >
                      <AccountsIcon className="v-mid pb1 pr1" size={18} />
                      <span className="banner__navigation__item__text no-underline">
                        Accounts
                      </span>
                    </a>
                  ) :
                  null
              }
              <a
                className={classNames('gray', 'hover-blue', defaultLinkClassnames)}
                href="/signout"
              >
                <span className="banner__navigation__item__text no-underline">
                  Sign out
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Banner.propTypes = propTypes;

module.exports = Banner;
