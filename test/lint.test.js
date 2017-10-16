require('eslint'); // [KE] not required; establish the dependency for dependency checkers

const lint = require('mocha-eslint');

const options = {
  formatter: 'compact',
  slow: 10000,
  timeout: 30000
};

const paths = [
  'index.js',
  'lib'
];

lint(paths, options);
