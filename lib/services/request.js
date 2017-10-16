const Habrok = require('habrok');

const habrok = new Habrok();

module.exports = habrok.request.bind(habrok);
