const PathParser = require('path-parser');

const ROUTES = {
  accounts: new PathParser('/accounts'),
  account: new PathParser('/accounts/:id'),
  scenarios: new PathParser('/calculators'),
  scenario: new PathParser('/calculators/:id')
};

module.exports = ROUTES;
