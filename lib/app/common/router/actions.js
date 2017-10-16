const constants = require('./constants');
const dispatcher = require('../dispatcher');

const ACTIONS = constants.ACTIONS;

function navigate(path = '/', query = {}, state = {}) {
  dispatcher.dispatch({
    type: ACTIONS.NAVIGATE,
    body: {
      path,
      query,
      state
    }
  });
}

module.exports = {
  navigate
};
