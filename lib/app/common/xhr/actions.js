const constants = require('./constants');
const dispatcher = require('../dispatcher');

const ACTIONS = constants.ACTIONS;

function abort(req) {
  dispatcher.dispatch({
    type: ACTIONS.ABORT,
    body: req
  });
}

function error(req) {
  dispatcher.dispatch({
    type: ACTIONS.ERROR,
    body: req
  });
}

module.exports = {
  abort,
  error
};
