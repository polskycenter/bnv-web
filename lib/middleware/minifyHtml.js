const minifyHtml = require('express-minify-html');

module.exports = minifyHtml({
  override: true,
  htmlMinifier: {
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true
  }
});
