import fs from 'fs'
import crop 					from '../../../server/src/image-functions/crop.js'
import {
	newGame,
	addPlayer,
	removePlayer,
	addBodyPart,
	setDimensions,
	lockDimensions,
	addNewDrawing,
	incrementLevel,
	incrementProgress}		from '../../../server/src/core.js'
import 	{
	expect,
	assert}					from 'chai'
import {
	drawing1,
	drawing2,
	drawing3,
	drawing4,
	drawing5,
	drawing6}				from '../../helpers/test-drawings.js'

import {INITIAL_STATE} from '../../../server/src/new-game.js'
import deepFreeze 		from 'deep-freeze'
import clone					from 'clone'

const [player1, player2, player3] = [1,2,3]
const [head, body, legs] = ['head', 'body', 'legs']
const [body1, body2, body3] = [1,2,3]
const [game1, game2, game3] = [1,2,3]

describe('addPlayer', () => {
	var playerId, gameId, state, player

	beforeEach(function () {
		state = addPlayer({}, player1, game1)
		player = state.players[player1]
	})

	describe('initiall call', () => {

		it('adds first player to state.players', () => {
			assert(player)
		})

		it('assigns a body to the first player', () => {
			assert(player.body)
			assert.equal(player.body, 1)
		})

		it('increments player count', () => {
			assert.equal(state.players.num, 1)
		})
	})

	describe('consequtive calls', () => {
		var player
		var newState
		beforeEach(function () {
			newState = addPlayer(state, player2, game1)
			player = newState.players[player2]
		})
		it('adds a player state.players', () => {
			assert(player)
		})

		it('assigns a body to the player', () => {
			assert(player.body)
			assert.equal(player.body, 2)
		})

		it('increments player count', () => {
			assert.equal(newState.players.num, 2)
		})
	})
})


describe('removePlayer', () => {
	const state0 = newGame(player1)
	const state1 = addPlayer(state0, player2)
	const state2 = removePlayer(state1, player2)

	it('removes a player from player object', () => {
		assert.deepEqual(state2.players, state0.players)
	})

	it('resets body drawing data', () => {
		assert.deepEqual(state2.bodies, state0.bodies)
	})

	it('resets level', () => {
		assert(!state2.level.current)
	})

	it('inicates level has changed', () => {
		assert(state2.level.hasChanged)
	})
})


const state = deepFreeze({
	bodies: {1: {}, 2: {}, 3: {}},
	progress: 0,
	level: { current: 1, previous: null, hasChanged: true },
	players: {}
})

describe('addNewDrawing', () => {

	const nextState = addNewDrawing(state, body1, head, drawing1)

	it('has the new drawing', () => {
		assert.equal(nextState.bodies[body1][head], drawing1)
	})
	it('has the new clue drawing', () => {
		const clue = nextState.bodies[body1].clue
		assert.notEqual(nextState.bodies[body1].clue, '')
	})
})

describe('incrementLevel', () => {
	context('at beginning of round', () => {
		const nextState = incrementLevel(state)

		it('does not increment the level', () => {
			assert.equal(state.level.current, nextState.level.current)
		})
	})

	context('at end of a round', () => {
		const endState = clone(state)
		endState.progress = 3
		const nextState = incrementLevel(endState)

		it('increments the level', () => {
			assert.equal(endState.level.current+1, nextState.level.current)
		})
	})
})

describe('incrementProgress', () => {

	context('on first drawing of level', () => {
		const nextState = incrementProgress(state)
		it('increments progress', () => {
			assert.equal(state.progress + 1, nextState.progress)
		})
	})

	context('on last drawing of level', () => {
		const endState = clone(state)
		endState.progress = 3
		const nextState = incrementProgress(endState)
		it('resets progress', () => {
			assert.equal(nextState.progress, 1)
		})
	})
})

describe('setDimensions', () => {
	const newState = {players: {1: {dimensions: {}}}}
	const dimensions = {height: 123, width: 321}
	const nextState = setDimensions(newState, player1, dimensions)

	const { height, width } = nextState.players[player1].dimensions

	it('adds a player\'s phone dimensions to state object', () => {
		assert.equal(height, 123)
		assert.equal(width, 321)
	})
})

describe('lockDimensions', () => {
	const newState = {
		players: {
			1: {dimensions: {height: 1, width: 2}},
			2: {dimensions: {height: 3, width: 4}},
			3: {dimensions: {height: 2, width: 1}},
		}
	}

	const dimensions = lockDimensions(newState)

	it('sets dimensions to those of smallest player device', () => {
		assert.deepEqual(dimensions, {height: 1, width: 2})
	})
})




describe('After 9 rounds', () => {
	const gameSetup = [
		addPlayer,
		addPlayer,
		addPlayer
	]

	const setDs = [
		setDimensions,
		setDimensions,
		setDimensions
	]

	const level1 = [
		addBodyPart,
		addBodyPart,
		addBodyPart
	]

	const level2 = [
		addBodyPart,
		addBodyPart,
		addBodyPart
	]

	const level3 = [
		addBodyPart,
		addBodyPart,
		addBodyPart
	]

	const state = gameSetup.reduce( (state, action, i) => action(state, i+1), {})
	const state2 = setDs.reduce( (state, action, i) => action(state, i+1, {height: i+1, width: i+2 }),state)
	const state3 = level1.reduce( (state, action, i) => action(state, i+1, head, drawing1), state2)
	const state4 = level2.reduce( (state, action, i) => action(state, i+1, body, drawing2), state3)
	const final = level3.reduce( (state, action, i) => action(state, i+1, legs, drawing3), state4)

	for(let i = 1; i < 4; i++) {
		it(`each player has their original drawing back`, () => {
			assert.equal(final.players[i].body, i)
		})

		it('each body has a final drawing dataURL string', () => {
			expect(final.bodies[i].final).to.not.be.empty
		})

		it('each final drawing is a valid dataURL string', () => {
			expect(final.bodies[i].final).to.contain('data:image/png;base64,')
		})
	}
})
