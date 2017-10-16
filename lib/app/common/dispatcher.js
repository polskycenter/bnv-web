const Dispatcher = require('flux').Dispatcher;

const dispatcher = new Dispatcher();

// [KE] debug only
// dispatcher.register(action => console.log(action.type, action.body));

module.exports = dispatcher;
