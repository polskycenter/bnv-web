const debug = require('debug')('@polskycenter/bnv-web:routes:signin:post');

const env = require('../../env');
const request = require('../../services/request');

const HOST_API = env('HOST_API');
const HOST_CLIENT = env('HOST_CLIENT');

function post(req, res) {
  const email = req.body.email;

  return request({
    method: 'POST',
    uri: `${HOST_API}/v1/sessions`,
    body: {
      email,
      exchangeUrl: `${HOST_CLIENT}/activate`
    }
  }).then(
    () => res.render('signin', { isSubmitted: true, errorCode: null })
  ).catch((err) => {
    debug('signin error', err);

    const statusCode = err.isBoom ? err.output.statusCode : 500;

    res.render('signin', { isSubmitted: false, errorCode: statusCode });
  });
}

module.exports = post;
