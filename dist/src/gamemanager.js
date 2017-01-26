'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GAMEMANAGER = undefined;

var _store = require('./store.js');

var newGame = function newGame() {
	var store = (0, _store.makeStore)();
	store.dispatch({ type: '' });
	return { store: store };
};

var subscribePlayer = function subscribePlayer(io, socket, game) {
	game.subscribe(function () {
		var state = game.getState();
		var hasChanged = state.level.hasChanged;

		var valid = state.players.hasOwnProperty(socket.id);
		if (hasChanged && valid) {
			return socket.emit('state', send(socket.id, state));
		}
	});
};

var newPlayer = function newPlayer(gameFloor, io) {

	return {
		add: function add(socket) {
			if (gameFloor.freeGames.length === 0) {
				var newgame = (0, _store.makeStore)();
				var _gameId = Math.floor(Math.random() * (10000000000 - 1000000));
				gameFloor.activeGames[_gameId] = newgame;
				gameFloor.freeGames.push(_gameId);
			}
			var gameId = gameFloor.freeGames[0];
			var game = gameFloor.activeGames[gameId];
			gameFloor.players[socket.id] = gameId;

			//subscribe player to game changes
			subscribePlayer(io, socket, game);

			//update game
			game.dispatch({
				type: 'ADD_PLAYER',
				playerId: socket.id,
				gameId: gameId
			});

			gameFloor.freeGames = updateFreeGames(game, gameFloor.freeGames);
			console.log(socket.id, 'joined game:', gameId);
		}
	};
};

var updateFreeGames = function updateFreeGames(game, freeGames) {
	if (game.getState().players.num === 3) {
		freeGames.splice(freeGames.indexOf(game.getState().gameId), 1);
	}
	return freeGames;
};

var removePlayer = function removePlayer(gameFloor) {
	return {
		eject: function eject(socket) {
			var gameId = gameFloor.players[socket.id];
			var game = gameFloor.activeGames[gameId];
			var freeGames = gameFloor.freeGames;
			game.dispatch({
				type: 'REMOVE_PLAYER',
				playerId: socket.id
			});
			delete gameFloor.players[socket.id];
			if (!freeGames.includes(gameId)) {
				freeGames.push(gameId);
			}
		}
	};
};

var updateGame = function updateGame(gameFloor) {
	return {
		play: function play(socketId, data) {
			var gameId = gameFloor.players[socketId];
			var game = gameFloor.activeGames[gameId];
			game.dispatch(data);
			console.log(socketId, 'Updated game', gameFloor.players[socketId]);
		}
	};
};

var parts = {
	1: 'head',
	2: 'body',
	3: 'legs'
};

var send = function send(id, state) {
	return {
		level: state.level.current,
		body: state.bodies[state.players[id].body],
		num: state.players[id].body,
		part: parts[state.level.current],
		dimensions: state.dimensions
	};
};

var GAMEMANAGER = exports.GAMEMANAGER = function GAMEMANAGER(io) {
	var gameFloor = {
		activeGames: {},
		freeGames: [],
		players: {}
	};

	var players = {};

	return Object.assign({}, newPlayer(gameFloor, io), removePlayer(gameFloor), updateGame(gameFloor), { print: function print() {
			return Object.assign({}, gameFloor);
		} });
};