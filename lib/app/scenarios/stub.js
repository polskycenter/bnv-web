const constants = require('./constants');

const PREFIX = constants.TEMPORARY_ID_PREFIX;

function stub() {
  return {
    id: `${PREFIX}_${Date.now().toString(36)}`,
    engine: 'basic',
    title: '',
    actions: [],
    prior: 0.5,
    evidenceLevels: {
      min: 0.4,
      low: 0.45,
      medium: 0.5,
      high: 0.55,
      max: 0.6
    },
    importanceWeights: {
      low: 0.5,
      medium: 1,
      high: 2
    }
  };
}

module.exports = stub;
