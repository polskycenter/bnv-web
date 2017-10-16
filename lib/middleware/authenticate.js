const debug = require('debug')('@polskycenter/bnv-web:middleware:authenticate');

const cookieData = require('../utils/cookieData');
const env = require('../env');
const request = require('../services/request');

const HOST_API = env('HOST_API');
const COOKIE_NAME = env('COOKIE_NAME');

function middleware(req, res, next) {
  if (!req.signedCookies || !req.signedCookies[COOKIE_NAME]) {
    debug('missing signed cookie: %j', req.signedCookies);
    return res.redirect('/signin');
  }

  const cookie = cookieData.deserialize(req.signedCookies[COOKIE_NAME]);

  if (!cookie.accountId || !cookie.sessionId || !cookie.key) {
    debug('missing cookie parameters: %j', cookie);
    return res.redirect('/signin');
  }

  return request({
    auth: { user: cookie.key },
    method: 'GET',
    uri: `${HOST_API}/v1/accounts/${cookie.accountId}`
  }).then((response) => {
    req.account = response.body; // eslint-disable-line no-param-reassign
    req.session = { id: cookie.sessionId, key: cookie.key }; // eslint-disable-line no-param-reassign, max-len

    return next();
  }).catch((err) => {
    debug('invalid or expired session', err);
    return res.redirect('/signin');
  });
}

module.exports = middleware;
