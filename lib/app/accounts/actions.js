const constants = require('./constants');
const dispatcher = require('../common/dispatcher');
const xhr = require('../common/xhr/request');

const ACTIONS = constants.ACTIONS;
const HOST = global.preload.host;
const PREFIX = constants.TEMPORARY_ID_PREFIX;

function reconcile(previous, target) {
  if (target.id.startsWith(PREFIX)) {
    return xhr({
      method: 'POST',
      uri: '/accounts',
      body: {
        name: target.name,
        email: target.email,
        exchangeUrl: `${HOST}/verify`,
        isBuilder: target.isBuilder,
        isManager: target.isManager
      }
    });
  }

  const patches = [];

  if (previous.name !== target.name) {
    patches.push({
      op: 'replace',
      path: '/name',
      value: target.name
    });
  }

  if (previous.email !== target.email) {
    patches.push({
      op: 'replace',
      path: '/email',
      value: target.email
    });
  }

  if (previous.isBuilder !== target.isBuilder) {
    patches.push({
      op: 'replace',
      path: '/isBuilder',
      value: target.isBuilder
    });
  }

  if (previous.isManager !== target.isManager) {
    patches.push({
      op: 'replace',
      path: '/isManager',
      value: target.isManager
    });
  }

  if (patches.length === 0) {
    return Promise.resolve({ body: previous });
  }

  return xhr({
    method: 'PATCH',
    uri: `/accounts/${target.id}`,
    body: patches
  });
}

function del(accountId) {
  xhr({ method: 'DELETE', uri: `/accounts/${accountId}` }).then(() => {
    dispatcher.dispatch({
      type: ACTIONS.REMOVE,
      body: {
        accountId
      }
    });
  });
}

function resolve(previous, target, done) {
  reconcile(previous, target).then((res) => {
    dispatcher.dispatch({
      type: ACTIONS.SET,
      body: {
        account: res.body
      }
    });

    done();
  });
}

function sync() {
  // [KE] 9999 is a proxy for "all" accounts
  xhr({ uri: '/accounts?limit=9999' }).then((res) => {
    dispatcher.dispatch({
      type: ACTIONS.SYNC,
      body: {
        accounts: res.body
      }
    });
  });
}

module.exports = {
  delete: del,
  sync,
  resolve
};
