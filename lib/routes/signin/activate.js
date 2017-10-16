const debug = require('debug')('@polskycenter/bnv-web:routes:signin:activate');

const cookieData = require('../../utils/cookieData');
const env = require('../../env');
const request = require('../../services/request');

const COOKIE_NAME = env('COOKIE_NAME');
const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7776000000, // [KE] 90 days, in ms; same as api session model lifespan
  secure: env('IS_PRODUCTION'),
  signed: true
};
const HOST_API = env('HOST_API');

function get(req, res) {
  const token = req.query.token;

  return request({
    method: 'GET',
    uri: `${HOST_API}/v1/sessions/activations?token=${token}`
  }).then((response) => {
    const session = response.body;

    res.cookie(
      COOKIE_NAME,
      cookieData.serialize(session.accountId, session.id, session.key),
      COOKIE_OPTIONS
    );

    return res.redirect('/calculators');
  }).catch((err) => {
    debug('activation error', err);

    res.render(
      'signin',
      {
        email: '',
        errorCode: err.isBoom ? err.output.statusCode : 500,
        isSubmitted: false
      }
    );
  });
}

module.exports = get;
