const Stapes = require('stapes');

const constants = require('./constants');
const dispatcher = require('../common/dispatcher');

const ACTIONS = constants.ACTIONS;

function compareByName(a, b) {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  }

  return 0;
}

const Accounts = Stapes.subclass({
  constructor: function constructor() {
  },
  sync: function sync(accounts) {
    this.remove();

    this.set(accounts.reduce(
      (out, account) => Object.assign(out, { [account.id]: account }),
      {}
    ));
  }
});

const accounts = new Accounts();

accounts.extend({
  compareByName
});

dispatcher.register((action) => {
  switch (action.type) {
    case ACTIONS.REMOVE:
      accounts.remove(action.body.accountId);
      break;
    case ACTIONS.SET:
      accounts.set(action.body.account.id, action.body.account);
      break;
    case ACTIONS.SYNC:
      accounts.sync(action.body.accounts);
      break;
    default:
      break;
  }
});

module.exports = accounts;
