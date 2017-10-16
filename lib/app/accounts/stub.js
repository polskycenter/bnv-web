const constants = require('./constants');

const PREFIX = constants.TEMPORARY_ID_PREFIX;

function stub() {
  return {
    id: `${PREFIX}_${Date.now().toString(36)}`,
    name: '',
    email: '',
    isBuilder: false,
    isManager: false
  };
}

module.exports = stub;
