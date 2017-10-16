const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const ToggleOff = require('react-feather/dist/icons/circle').default;
const ToggleOn = require('react-feather/dist/icons/check-circle').default;

const propTypes = {
  description: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isFixed: PropTypes.bool.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
};

class AccountPermission extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClickToggle = this.onClickToggle.bind(this);
  }

  onClickToggle() {
    const isDisabled = this.props.isDisabled;
    const toggle = this.props.toggle;

    if (!isDisabled) {
      toggle();
    }
  }

  render() {
    const description = this.props.description;
    const isActive = this.props.isActive;
    const isDisabled = this.props.isDisabled;
    const isFixed = this.props.isFixed;
    const slug = `permission-${this.props.slug}`;
    const title = this.props.title;

    const labelClassNames = classNames([
      'db',
      'f6',
      'fw6',
      'lh-copy'
    ]);

    return (
      <div className="account-permission pb2">
        <div className="dib ph3">
          {
            isActive ?
              (
                <ToggleOn
                  className={classNames(
                    'pb1',
                    {
                      gray: isDisabled,
                      green: !isDisabled,
                      pointer: (!isFixed && !isDisabled)
                    }
                  )}
                  id={slug}
                  onClick={this.onClickToggle}
                  size={24}
                />
              ) : (
                <ToggleOff
                  className={classNames(
                    'pb1',
                    {
                      'hover-gray': !isDisabled,
                      gray: isDisabled,
                      pointer: (!isFixed && !isDisabled),
                      silver: !isDisabled
                    }
                  )}
                  id={slug}
                  onClick={this.onClickToggle}
                  size={24}
                />
              )
          }
        </div>
        <div className="dib">
          <label className={labelClassNames} htmlFor={slug}>{title}</label>
          <p className="f6 normal black-60 ma0">
            {description}
          </p>
        </div>
      </div>
    );
  }
}

AccountPermission.propTypes = propTypes;

module.exports = AccountPermission;
