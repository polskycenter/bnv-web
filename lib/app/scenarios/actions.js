const constants = require('./constants');
const dispatcher = require('../common/dispatcher');
const xhr = require('../common/xhr/request');

const ACTIONS = constants.ACTIONS;
const PREFIX = constants.TEMPORARY_ID_PREFIX;

function deleteAction(scenarioId, actionId) {
  return xhr({ method: 'DELETE', uri: `/scenarios/${scenarioId}/actions/${actionId}` });
}

function reconcileAction(previous, target) {
  if (target.id.startsWith(PREFIX)) {
    return xhr({
      method: 'POST',
      uri: `/scenarios/${target.scenarioId}/actions`,
      body: {
        title: target.title,
        importance: target.importance,
        sortOrder: target.sortOrder
      }
    });
  }

  const patches = [];

  if (previous.title !== target.title) {
    patches.push({
      op: 'replace',
      path: '/title',
      value: target.title
    });
  }

  if (previous.importance !== target.importance) {
    patches.push({
      op: 'replace',
      path: '/importance',
      value: target.importance
    });
  }

  if (previous.sortOrder !== target.sortOrder) {
    patches.push({
      op: 'replace',
      path: '/sortOrder',
      value: target.sortOrder
    });
  }

  if (patches.length === 0) {
    return Promise.resolve(null);
  }

  return xhr({
    method: 'PATCH',
    uri: `/scenarios/${target.scenarioId}/actions/${target.id}`,
    body: patches
  });
}

function reconcileScenario(previous, target) {
  if (target.id.startsWith(PREFIX)) {
    return xhr({
      method: 'POST',
      uri: '/scenarios',
      body: {
        title: target.title,
        prior: target.prior,
        evidenceLevels: target.evidenceLevels,
        importanceWeights: target.importanceWeights
      }
    });
  }

  const patches = [];

  if (previous.title !== target.title) {
    patches.push({
      op: 'replace',
      path: '/title',
      value: target.title
    });
  }

  if (previous.prior !== target.prior) {
    patches.push({
      op: 'replace',
      path: '/prior',
      value: target.prior
    });
  }

  Object.keys(target.evidenceLevels).forEach((level) => {
    if (previous.evidenceLevels[level] !== target.evidenceLevels[level]) {
      patches.push({
        op: 'replace',
        path: `/evidenceLevels/${level}`,
        value: target.evidenceLevels[level]
      });
    }
  });

  Object.keys(target.importanceWeights).forEach((level) => {
    if (previous.importanceWeights[level] !== target.importanceWeights[level]) {
      patches.push({
        op: 'replace',
        path: `/importanceWeights/${level}`,
        value: target.importanceWeights[level]
      });
    }
  });

  if (patches.length === 0) {
    return Promise.resolve({ body: previous });
  }

  return xhr({
    method: 'PATCH',
    uri: `/scenarios/${target.id}`,
    body: patches
  });
}

function remove(scenarioId) {
  xhr({ method: 'DELETE', uri: `/scenarios/${scenarioId}` }).then(() => {
    dispatcher.dispatch({
      type: ACTIONS.REMOVE,
      body: {
        scenarioId
      }
    });
  });
}

function resolve(previous, target, done) {
  reconcileScenario(previous, target).then((res) => {
    const current = res.body;
    const tasks = [];

    const previousActions = previous.actions.reduce((out, action) => {
      out[action.id] = action; // eslint-disable-line no-param-reassign
      return out;
    }, {});

    const targetActions = target.actions.reduce((out, action) => {
      out[action.id] = Object.assign(action, { scenarioId: current.id }); // eslint-disable-line no-param-reassign, max-len
      return out;
    }, {});

    Object.keys(previousActions).forEach((previousActionId) => {
      if (!targetActions[previousActionId]) {
        tasks.push(deleteAction(previous.id, previousActionId));
      }
    });

    Object.keys(targetActions).forEach((targetActionId) => {
      tasks.push(reconcileAction(previousActions[targetActionId], targetActions[targetActionId]));
    });

    return Promise.all(tasks).then(() => xhr({ uri: `/scenarios/${current.id}` }));
  }).then((res) => {
    dispatcher.dispatch({
      type: ACTIONS.SET,
      body: {
        scenario: res.body
      }
    });

    done();
  });
}

function sync() {
  // [KE] 9999 is a proxy for "all" scenarios
  xhr({ uri: '/scenarios?limit=9999' }).then((res) => {
    dispatcher.dispatch({
      type: ACTIONS.SYNC,
      body: {
        scenarios: res.body
      }
    });
  });
}

module.exports = {
  delete: remove,
  sync,
  resolve
};
