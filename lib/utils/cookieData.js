const crypto = require('crypto');
const debug = require('debug')('@polskycenter/bnv-web:utils:cookieData');

const env = require('../env');

const ALGORITHM = 'aes128';
const SECRET = env('SECRET');

function deserialize(raw) {
  const decipher = crypto.createDecipher(ALGORITHM, SECRET);

  let decrypted;

  try {
    decrypted = decipher.update(raw, 'base64', 'utf8') + decipher.final('utf8');
  } catch (err) {
    debug('error deserializing cookie', err);
    decrypted = JSON.stringify({});
  }

  decrypted = JSON.parse(decrypted);

  return {
    accountId: decrypted.a || null,
    sessionId: decrypted.s || null,
    key: decrypted.k || null
  };
}

function serialize(accountId, sessionId, key) {
  debug('serialize', accountId, sessionId, key);

  const cipher = crypto.createCipher(ALGORITHM, SECRET);
  const data = JSON.stringify({ a: accountId, s: sessionId, k: key });

  return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
}

module.exports = {
  deserialize,
  serialize
};
