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
		previous: null
	},
	progress: 0,
	players: {
		num: 1,
	},
	send: function (id) {
		if(!this.players[id]) {
			console.log('player id: ' + id)
			console.log('players: ', this.players)
		}
		return {
			level: this.level.current,
			body: this.bodies[this.players[id].body],
			num: this.players[id].body
		}
	}
})
export {INITIAL_STATE}
