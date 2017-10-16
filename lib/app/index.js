/* eslint react/jsx-filename-extension: 0 */

const PromisePolyfill = require('promise-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');

const Index = require('./index/Main.jsx');

if (!global.Promise) {
  global.Promise = PromisePolyfill;
}

ReactDOM.render(
  (
    <Index
      isBuilder={global.preload.account.isBuilder}
      isManager={global.preload.account.isManager}
    />
  ),
  global.document.querySelectorAll('.bnv')[0]
);
