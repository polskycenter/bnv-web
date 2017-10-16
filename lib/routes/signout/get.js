const debug = require('debug')('@polskycenter/bnv-web:routes:signin:activate');

const env = require('../../env');
const request = require('../../services/request');

const COOKIE_NAME = env('COOKIE_NAME');
const HOST_API = env('HOST_API');

function get(req, res) {
  const key = req.session.key;
  const sessionId = req.session.id;

  res.clearCookie(COOKIE_NAME);

  return request({
    auth: { user: key },
    method: 'DELETE',
    uri: `${HOST_API}/v1/sessions/${sessionId}`
  }).then(
    () => null
  ).catch((err) => {
    debug('unable to delete key', err);
    return null;
  }).then(
    () => res.redirect('/signin')
  );
}

module.exports = get;
