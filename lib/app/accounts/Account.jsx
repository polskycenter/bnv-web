const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const constants = require('./constants');
const fluxActions = require('./actions');
const navigate = require('../common/router/actions').navigate;
const Permission = require('./AccountPermission.jsx');
const routes = require('../common/router/routes');

const PREFIX = constants.TEMPORARY_ID_PREFIX;

const propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isBuilder: PropTypes.bool.isRequired,
  isManager: PropTypes.bool.isRequired,
  stopEditing: PropTypes.func.isRequired,
  timeConfirmed: PropTypes.string
};

const defaultProps = {
  timeConfirmed: null
};

class Account extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      isSaving: false,
      name: props.name,
      email: props.email,
      isBuilder: props.isBuilder,
      isManager: props.isManager
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickIsBuilder = this.onClickIsBuilder.bind(this);
    this.onClickIsManager = this.onClickIsManager.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  onClickCancel() {
    const stopEditing = this.props.stopEditing;

    return stopEditing();
  }

  onClickDelete() {
    const isConfirmed = global.confirm('Permanently delete this account?');

    if (isConfirmed) {
      fluxActions.delete(this.props.id);

      navigate(routes.accounts.build());
    }
  }

  onClickSave() {
    const stopEditing = this.props.stopEditing;

    this.setState({ isSaving: true });

    fluxActions.resolve(this.props, this.state, () => stopEditing());
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onClickIsBuilder() {
    const isBuilder = this.state.isBuilder;

    this.setState({
      isBuilder: !isBuilder
    });
  }

  onClickIsManager() {
    const isManager = this.state.isManager;

    this.setState({
      isManager: !isManager
    });
  }

  render() {
    const accountId = this.props.id;
    const email = this.state.email;
    const isBuilder = this.state.isBuilder;
    const isConfirmed = this.props.id.startsWith(PREFIX) ? true : Boolean(this.props.timeConfirmed);
    const isManager = this.state.isManager;
    const isSaving = this.state.isSaving;
    const name = this.state.name;

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
      <div className="account">
        <div className="center mv4 w-80">
          <div className="account__details ba b--near-white bg-white br1 mt4 shadow-4 pv4 ph5">
            {
              isConfirmed ?
                null : (
                  <div className="b ba br2 mb4 pa3 gold bg-washed-yellow">
                    This account has not been confirmed by the owner of the email address.
                  </div>
                )
            }
            <div className="dt dt-fixed mb4 w-100">
              <div className="dtc pr2 w-50">
                <label className={labelClassNames} htmlFor="account-name">Name</label>
                <input
                  className={fieldClassNames}
                  disabled={!isConfirmed}
                  id="account-name"
                  onChange={this.onChangeName}
                  value={name}
                />
              </div>
              <div className="dtc pl2 w-50">
                <label className={labelClassNames} htmlFor="account-email">Email</label>
                <input
                  className={fieldClassNames}
                  disabled={!isConfirmed}
                  id="account-email"
                  onChange={this.onChangeEmail}
                  value={email}
                />
              </div>
            </div>

            <p className="ma0 pb2 f4">
              Permissions
            </p>
            <div className="mb4 w-100">
              <Permission
                description={'A viewer can use all calculators; this permission cannot be disabled'}
                isActive
                isDisabled={!isConfirmed}
                isFixed
                slug={'viewer'}
                title={'Viewer'}
                toggle={() => null}
              />
              <Permission
                description={'A builder can create and modify a calculator'}
                isActive={isBuilder}
                isDisabled={!isConfirmed}
                isFixed={false}
                slug={'builder'}
                title={'Builder'}
                toggle={this.onClickIsBuilder}
              />
              <Permission
                description={'A manager can invite other accounts and modify account permissions'}
                isActive={isManager}
                isDisabled={!isConfirmed}
                isFixed={false}
                slug={'manager'}
                title={'Manager'}
                toggle={this.onClickIsManager}
              />
            </div>

            {
              isSaving ?
                (
                  <div className="dt mb2 w-100">
                    <div className="dtc tr v-mid">
                      <span className="account__saving b dark-pink dib tl">
                        <span className="threedots">&nbsp;</span>
                      </span>
                    </div>
                  </div>
                ) :
                (
                  <div className="dt mb2 w-100">
                    {
                      accountId.startsWith(PREFIX) ?
                        null :
                        (
                          <div className="dtc">
                            <button
                              className="blue bn bg-transparent f6 hover-red input-reset pointer"
                              onClick={this.onClickDelete}
                            >
                              Delete this account
                            </button>
                          </div>
                        )
                    }
                    <div className="dtc tr v-mid">
                      <button
                        className="blue bn bg-transparent f6 hover-blue input-reset mr4 pointer"
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
        </div>
      </div>
    );
  }
}

Account.propTypes = propTypes;
Account.defaultProps = defaultProps;

module.exports = Account;
