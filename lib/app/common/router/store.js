const queryString = require('query-string');
const Stapes = require('stapes');

const constants = require('./constants');
const dispatcher = require('../dispatcher');

const ACTIONS = constants.ACTIONS;
const HAS_HISTORY_API = (typeof global.history.pushState === 'function');
const TITLE_DEFAULT = 'BNV Calculators';

function sanitizePath(path) {
  return path.replace(/\/$/, '').replace(/^\//, '');
}

const Router = Stapes.subclass({
  constructor: function constructor(baseUrl = '/') {
    this.baseUrl = baseUrl;

    this.reflect({});

    if (HAS_HISTORY_API) {
      global.addEventListener('popstate', this.reflect.bind(this));
    }
  },
  reflect: function reflect(e) {
    const url = new global.URL(global.document.location);

    const path = url.pathname;
    const query = queryString.parse(url.search);
    const state = e.state || {};
    const title = state.title ? `${state.title} · ${TITLE_DEFAULT}` : TITLE_DEFAULT;

    global.document.title = title;

    this.set({ path, query, state });
  },
  navigate: function navigate(path = '', query = {}, state = {}) {
    const search = queryString.stringify(query);

    const location = `${this.baseUrl}${sanitizePath(path)}${search ? `?${search}` : ''}`;
    const title = state.title ? `${state.title} · ${TITLE_DEFAULT}` : TITLE_DEFAULT;

    global.document.title = title;

    if (HAS_HISTORY_API && location) {
      global.history.pushState(state, state.title || null, location);
    }

    this.set({ path, query, state });
  }
});

const router = new Router();

dispatcher.register((action) => {
  switch (action.type) {
    case ACTIONS.NAVIGATE:
      router.navigate(action.body.path, action.body.query, action.body.state);
      break;
    default:
      break;
  }
});

module.exports = router;
