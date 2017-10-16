const has = require('has');

const config = {
  HOST_API: process.env.BNV__HOST_API,
  HOST_CLIENT: process.env.BNV__HOST_CLIENT,
  COOKIE_NAME: 'bnv',
  IS_PRODUCTION: process.env.BNV__ENVIRONMENT === 'production',
  PORT: 8080,
  SECRET: process.env.BNV__SECRET
};

function get(param) {
  if (!has(config, param)) {
    throw new Error(`unknown configuration parameter: ${param}`);
  }

  return config[param];
}

module.exports = get;
