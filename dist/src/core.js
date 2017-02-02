'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resetProgress = exports.resetLevel = exports.startGame = exports.setDimensions = exports.incrementProgress = exports.addNewDrawing = exports.incrementLevel = exports.addBodyPart = exports.removePlayer = exports.addPlayer = exports.newGame = undefined;

var _crop = require('./image-functions/crop.js');

var _crop2 = _interopRequireDefault(_crop);

var _final = require('./image-functions/final.js');

var _final2 = _interopRequireDefault(_final);

var _newGame = require('./new-game.js');

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newGame = exports.newGame = function newGame(playerId, gameId) {
	var nextState = (0, _clone2.default)(_newGame.INITIAL_STATE);
	nextState.players[playerId] = { body: 1 };
	nextState.gameId = gameId;
	return (0, _deepFreeze2.default)(nextState);
};

var countDimensions = function countDimensions(players) {
	var count = 0;
	for (var player in players) {
		players[player].dimensions ? count++ : null;
	}
	return count;
};

var addPlayer = exports.addPlayer = function addPlayer(state, playerId) {
	var gameId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	if (!state.players) return newGame(playerId, gameId);
	if (state.players.num === 3) return Object.freeze(state);

	var nextState = (0, _clone2.default)(state);
	nextState.players.num++;
	var nextPlayer = nextState.players.num;
	nextState.players[playerId] = { body: nextPlayer };

	return (0, _deepFreeze2.default)(nextState);
};

var removePlayer = exports.removePlayer = function removePlayer(state, playerId) {
	var nextState = (0, _clone2.default)(state);

	nextState.bodies = _newGame.INITIAL_STATE.bodies;

	delete nextState.players[playerId];
	nextState.players.num--;

	nextState.level = { current: null, previous: null, hasChanged: true };

	return (0, _deepFreeze2.default)(nextState);
};

var addBodyPart = exports.addBodyPart = function addBodyPart(state, bodyNum, part, drawing) {
	var nextState = (0, _clone2.default)(state);
	nextState = addNewDrawing(nextState, bodyNum, part, drawing);

	var actions = [incrementProgress, incrementLevel, scramble, _final2.default];

	return (0, _deepFreeze2.default)(actions.reduce(function (state, action) {
		return action(state);
	}, nextState));
};

// //////////////////////////// HELPERS   ///////////////////
var scramble = function scramble(state) {
	if (state.level.hasChanged) {
		state = (0, _clone2.default)(state);
		var players = Object.assign({}, state.players);
		var ids = Object.keys(players);
		ids.splice(ids.indexOf('num'), 1); //remove num property
		for (var i = 0; i < 3; i++) {
			players[ids[i]].body = players[ids[i]].body == 3 ? 1 : players[ids[i]].body + 1;
		}
		state.players = players;
		return state;
	}

	return state;
};

var incrementLevel = exports.incrementLevel = function incrementLevel(state) {
	state = (0, _clone2.default)(state);
	var _state$level = state.level,
	    current = _state$level.current,
	    previous = _state$level.previous;
	var _state = state,
	    progress = _state.progress;

	state.level = state.progress === 3 ? { current: current + 1, previous: current, hasChanged: true } : { current: current, previous: current, hasChanged: false };
	return state;
};

var addNewDrawing = exports.addNewDrawing = function addNewDrawing(state, bodyNum, part, drawing) {

	//find the player the drawing belongs to
	var player = void 0;
	var players = state.players;
	var ids = Object.keys(players);
	ids.splice(ids.indexOf('num'), 1); //remove num property
	for (var i = 0; i < 3; i++) {
		if (players[ids[i]].body === bodyNum) {
			player = ids[i];
			var _state$players$player = state.players[player].dimensions,
			    width = _state$players$player.width,
			    height = _state$players$player.height;
			//generate cropped and upadte state

			state = (0, _clone2.default)(state);
			var cropped = (0, _crop2.default)(drawing, width, height);
			state.bodies[bodyNum][part] = drawing;
			state.bodies[bodyNum].clue = cropped;

			return state;
		}
	}
};

var incrementProgress = exports.incrementProgress = function incrementProgress(state) {
	state = (0, _clone2.default)(state);
	if (state.progress < 3) {
		state.progress++;
	} else {
		state.progress = 1;
	}

	return state;
};

var setDimensions = exports.setDimensions = function setDimensions(state, playerId, dimensions) {
	if (!dimensions) return state;
	var nextState = (0, _clone2.default)(state);
	nextState.players[playerId].dimensions = dimensions;
	return (0, _deepFreeze2.default)(startGame(nextState));
};

var startGame = exports.startGame = function startGame(state) {
	if (countDimensions(state.players) === 3) {
		state = (0, _clone2.default)(state);
		state.level.current = 1;
		state.level.hasChanged = true;
		return (0, _deepFreeze2.default)(state);
	}

	return state;
};

var resetLevel = exports.resetLevel = function resetLevel(state) {
	nextState = (0, _clone2.default)(state);
	nextState.level = _newGame.INITIAL_STATE.level;

	return nextState;
};

var resetProgress = exports.resetProgress = function resetProgress(state) {
	nextState = (0, _clone2.default)(state);
	nestState.progress = 0;

	return nextState;
};