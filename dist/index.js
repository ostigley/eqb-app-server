'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = undefined;

var _store = require('./src/store.js');

var _server = require('./src/server.js');

var store = exports.store = (0, _store.makeStore)();

store.dispatch({ type: '' });
(0, _server.startServer)(store);