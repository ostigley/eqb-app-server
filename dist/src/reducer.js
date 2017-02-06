'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _core = require('./core.js');

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  console.log('reducer reducing:', action.type);
  switch (action.type) {
    case 'NEW_GAME':
      return (0, _core.newGame)(action.playerId);
    case 'ADD_PLAYER':
      return (0, _core.addPlayer)(state, action.playerId, action.gameId);
    case 'REMOVE_PLAYER':
      return (0, _core.removePlayer)(state, action.playerId);
    case 'ADD_DRAWING':
      return (0, _core.addBodyPart)(state, action.body, action.part, action.drawing);
    case 'SET_DIMENSIONS':
      return (0, _core.setDimensions)(state, action.playerId, action.dimensions);
    case 'RESET':
      //testng only
      return {};
    default:
      return state;
  }
}