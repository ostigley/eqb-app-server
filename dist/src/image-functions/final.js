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
	var _state$dimensions = state.dimensions,
	    width = _state$dimensions.width,
	    height = _state$dimensions.height;

	var nextState = Object.assign({}, state);
	var parts = ['head', 'body', 'legs'];

	var _loop = function _loop(i) {
		var body = nextState.bodies[i];
		var canvas = new _canvas2.default(width, height * 3);
		var ctx = canvas.getContext('2d');

		parts.map(function (part, x) {
			var imageObj = new _canvas.Image();
			var dx = 0;
			var dy = x * height;
			imageObj.src = body[part];
			// // testing where image starts and finishes
			// ctx.beginPath();
			// // ctx.moveTo(0, dy); //start of image
			// ctx.moveTo(0, dy+ height); //end of image
			// ctx.lineTo(width, dy+height);
			// ctx.stroke();
			ctx.drawImage(imageObj, dx, dy, width, height);
		});
		body.final = canvas.toDataURL();
		nextState.bodies[i] = body;
	};

	for (var i = 1; i < 2; i++) {
		_loop(i);
	}
	return nextState;
};