import deepFreeze from 'deep-freeze'

const INITIAL_STATE = deepFreeze({
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
		num: 1,
	}
})
export {INITIAL_STATE}
