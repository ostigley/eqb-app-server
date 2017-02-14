import reducer	from '../../../server/src/reducer.js'
import 	{
	expect,
	assert}				from 'chai'
import deepFreeze from 'deep-freeze'
import {
	drawing1,
	drawing2,
	drawing3}			from '../../helpers/test-drawings.js'

	import {
	newGame,
	addPlayer,
	addBodyPart}	from '../../../server/src/core.js'
import {INITIAL_STATE} from '../../../server/src/new-game.js'


const [player1, player2, player3] = [1,2,3]
const [head, body, legs] = ['head', 'body', 'legs']
const [body1, body2, body3] = [1,2,3]
const [game1, game2, game3] = [1,2,3]


describe('Reducer testing', () => {
	describe('Reducer START_GAME', () => {
		const action = {type: 'NEW_GAME', playerId: player1}
		const newGame = reducer(null, action)

		it('returns a frozen / immutable object', () => {
			assert(Object.isFrozen(newGame), 'it is frozen')
		})

		it('returns state object with "bodies" Object', () => {
			expect(Object.keys(newGame.bodies)).to.have.length(3)

			for (let body in newGame.bodies) {
				assert.equal(newGame.bodies[body].head, "")
				assert.equal(newGame.bodies[body].body, "")
				assert.equal(newGame.bodies[body].legs, "")
				assert.equal(newGame.bodies[body].clue, "")
				assert.equal(newGame.bodies[body].final, "")
			}
		})

		it('returns a null value for Level ', ()=> {
			expect(newGame.level.current).to.be.null
			expect(newGame.level.previous).to.be.null
		})

		it('returns a 0 value for progress because game not started', () =>{
			expect(newGame.progress).to.be.zero
		})

		it('returns a player object, with one player', () => {
			assert.equal(newGame.players.num, 1)
			assert.equal(newGame.players[player1].body, 1)
		})
	})

	describe ('Reducer ADD_PLAYER', () => {

		const actions = [
			{type: 'NEW_GAME', playerId: player1},
			{type: 'ADD_PLAYER', playerId: player2}
		]

		const nextState = actions.reduce(reducer, {})

		it('returns a frozen / immutable object', () => {
			assert(Object.isFrozen(nextState), 'it is frozen')
		})

		it('adds a player to the player object', () => {
			assert.equal(nextState.players.num,2)
			assert(nextState.players[player2])
			expect(nextState.players[player2].body).to.equal(2)
		})
	})

	describe ('Reducer REMOVE_PLAYER', () => {
		const state = deepFreeze({
			bodies: {1: {}, 2: {}, 3: {}},
			progress: 0,
			level: { current: 1, previous: null, hasChanged: true },
			players: {
				num: 3,
				1: {body: body1, dimensions: {height: 100, width: 100}},
				2: {body: body2, dimensions: {height: 100, width: 100}},
				3: {body: body3, dimensions: {height: 100, width: 100}}
			}
		})

		const action = { type: 'REMOVE_PLAYER', playerId: player3 }

		const nextState = reducer(state, action)

		it('returns state to rolls back state . players', () => {
			assert.equal(nextState.players.num, 2)
			expect(nextState.players[3]).to.be.undefined
		})

		it('rolls back current and previous levels', () => {
			expect(nextState.level.current).to.be.null
			expect(nextState.level.previous).to.be.null
		})

		it('rolls back state body data to initial state', () => {
			assert.deepEqual(nextState.bodies, INITIAL_STATE.bodies)
		})
	})

	describe('Reducer ADD_DRAWING', () => {
		const state = deepFreeze({
			bodies: {1: {}, 2: {}, 3: {}},
			progress: 0,
			level: { current: 1, previous: null, hasChanged: true },
			players: {
				num: 3,
				1: {body: body1, dimensions: {height: 100, width: 100}},
				2: {body: body2, dimensions: {height: 100, width: 100}},
				3: {body: body3, dimensions: {height: 100, width: 100}}
			}
		})

		const action = {
			type: 'ADD_DRAWING',
			body: body1,
			part: head,
			drawing: drawing1
		}

		// const nextState = actions.reduce(reducer, {})
		const nextState = reducer(state, action)

		const content = nextState.bodies[body1][head]
		const clue = nextState.bodies[body1].clue

		it('returns a frozen / immutable object', () => {
			assert(Object.isFrozen(nextState), 'it is frozen')
		})

		it('updates body with a player\'s drawing', () => {
			expect(content).to.have.length.above(100)
			assert.equal(content, drawing1)
		})

		it('increments the progress', () => {
			assert(nextState.progress)
			assert.equal(nextState.progress, 1)
		})

		it('generates clue data, and adds is to state', () => {
			expect(clue).to.have.length.above(21)
			assert.notEqual(clue, drawing1)
		})

		it('increments progress to 2', () => {
			const nextState2 = addBodyPart(nextState, body2, body, drawing1)
			assert.equal(nextState2.progress, 2)
		})
	})

	describe('Reducer SET_DIMENSIONS', () => {
		let state = {
			players: {
				1: {}
			}
		}
		let action = {
	    type: 'SET_DIMENSIONS',
	    playerId: 1,
	    dimensions: {
	    	height: 123,
	    	width: 321
	    }
	  }

		let nextState = reducer(state, action)
		const { height, width } = nextState.players[1].dimensions

		it('adds a player\'s dimensions to state', () => {
			assert.equal(height, 123)
			assert.equal(width, 321)
		})
	})
})