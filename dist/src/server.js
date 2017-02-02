'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.startServer = undefined;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _gamemanager = require('./gamemanager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startServer = exports.startServer = function startServer() {
	var io = new _socket2.default().attach(process.env.PORT || 3000);

	var gameManager = (0, _gamemanager.GAMEMANAGER)(io);

	io.on('connection', function (socket) {
		console.log(socket.id, 'connected');
		gameManager.add(socket);

		socket.on('action', function (action) {
			gameManager.play(socket.id, action);
		});

		socket.on('disconnect', function () {
			console.log(socket.id, 'disconnected');
			gameManager.eject(socket);
		});
	});

	return io;
};