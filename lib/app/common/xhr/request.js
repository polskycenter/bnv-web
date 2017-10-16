const xhr = require('xhr');

const actions = require('./actions');

// [KE] designed for relative-path URLs; limited to same-origin XHR requests
function request(raw) {
  const req = Object.assign({ headers: {} }, raw);

  if (!Object.prototype.hasOwnProperty.call(req, 'method')) {
    req.method = 'GET';
  }

  req.headers['Content-Type'] = 'application/json';
  req.uri = `/api${req.uri}`;

  if (!Object.prototype.hasOwnProperty.call(req, 'json')) {
    req.json = true;
  }

  return new Promise((resolve, reject) => {
    xhr(req, (err, res, body) => {
      const statusCode = res ? res.statusCode : null;

      if (statusCode === 0) {
        actions.abort(req);
        return reject({ status: 0, headers: null, body: null });
      } else if (err || statusCode > 299) {
        actions.error(req);
        return reject({ status: statusCode, headers: res.headers, body });
      }

      return resolve({ headers: res.headers, body });
    });
  });
}

module.exports = request;
