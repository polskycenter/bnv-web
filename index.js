const debug = require('debug')('@bnv/web');
const http = require('http');

const app = require('./lib/app');
const env = require('./lib/env');

const server = http.createServer(app);

if (!env('IS_PRODUCTION')) {
  process.on('unhandledRejection', (stack) => {
    debug('unhandled promise error', stack);
  });
}

server.listen(env('PORT'));

server.on('error', (err) => { debug('server error', err); });
server.on('listening', () => { debug('listening', server.address()); });

module.exports = server;
