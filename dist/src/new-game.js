'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.INITIAL_STATE = undefined;

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = (0, _deepFreeze2.default)({
	bodies: {
		1: {
			head: '',
			body: '',
			legs: '',
			clue: '',
			final: ''
		},
		2: {
			head: '',
			body: '',
			legs: '',
			clue: '',
			final: ''
		},
		3: {
			head: '',
			body: '',
			legs: '',
			clue: '',
			final: ''
		}
	},
	level: {
		current: null,
		previous: null,
		hasChanged: false
	},
	progress: 0,
	players: {
		num: 1
	}
});
exports.INITIAL_STATE = INITIAL_STATE;