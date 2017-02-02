'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (state) {
	if (state.level.current < 4) {
		return state;
	}

	var _largestDimensions = largestDimensions(state),
	    width = _largestDimensions.width,
	    height = _largestDimensions.height;

	var nextState = Object.assign({}, state);
	var parts = ['head', 'body', 'legs'];

	//generate final images for each body

	var _loop = function _loop(i) {
		var body = nextState.bodies[i];
		var canvas = new _canvas2.default(width, height * 3);
		var ctx = canvas.getContext('2d');

		parts.map(function (part, x) {
			var imageObj = new _canvas.Image();
			var dx = 0;
			var dy = x * height;
			imageObj.onload = function () {
				ctx.drawImage(imageObj, dx, dy, width, height);
			};
			imageObj.src = body[part];
		});
		body.final = canvas.toDataURL();
		nextState.bodies[i] = body;
	};

	for (var i = 1; i < 4; i++) {
		_loop(i);
	}

	//generate amalgamated image
	var finalImageHeight = height * 3;
	var finalImageWidth = width;
	var finalCanvas = new _canvas2.default(width, finalImageHeight * 3);
	var finalCtx = finalCanvas.getContext('2d');
	var dx = 0;

	var _loop2 = function _loop2(i) {
		var dy = finalImageHeight * i - finalImageHeight; /* starting height must be zero */
		var imageObj = new _canvas.Image();
		imageObj.onload = function () {
			finalCtx.drawImage(imageObj, dx, dy, finalImageWidth, finalImageHeight);
		};
		imageObj.src = nextState.bodies[i].final;
	};

	for (var i = 1; i < 4; i++) {
		_loop2(i);
	}

	var finalImageAmalgamated = finalCanvas.toDataURL();

	for (var i = 1; i < 4; i++) {
		nextState.bodies[i].final = finalImageAmalgamated;
	}
	//add amalgamated image to each body.final

	return nextState;
};

var largestDimensions = function largestDimensions(state) {
	var players = state.players;

	var device = void 0;
	var area = 0;
	for (var player in players) {
		if (player !== 'num') {
			var _players$player$dimen = players[player].dimensions,
			    height = _players$player$dimen.height,
			    width = _players$player$dimen.width;

			var nextArea = height * width;
			if (nextArea > area) {
				area = nextArea;
				device = player;
			}
		}
	}

	return players[device].dimensions;
};