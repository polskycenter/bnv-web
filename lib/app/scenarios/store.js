const Stapes = require('stapes');

const constants = require('./constants');
const dispatcher = require('../common/dispatcher');

const ACTIONS = constants.ACTIONS;

function compareByTitle(a, b) {
  const titleA = a.title.toLowerCase();
  const titleB = b.title.toLowerCase();

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  }

  return 0;
}

const Scenarios = Stapes.subclass({
  constructor: function constructor() {
  },
  sync: function sync(scenarios) {
    this.remove();

    this.set(scenarios.reduce(
      (out, scenario) => Object.assign(out, { [scenario.id]: scenario }),
      {}
    ));
  }
});

const scenarios = new Scenarios();

scenarios.extend({
  compareByTitle
});

dispatcher.register((action) => {
  switch (action.type) {
    case ACTIONS.REMOVE:
      scenarios.remove(action.body.scenarioId);
      break;
    case ACTIONS.SET:
      scenarios.set(action.body.scenario.id, action.body.scenario);
      break;
    case ACTIONS.SYNC:
      scenarios.sync(action.body.scenarios);
      break;
    default:
      break;
  }
});

module.exports = scenarios;
