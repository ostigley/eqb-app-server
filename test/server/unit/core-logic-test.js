import fs from 'fs'
import crop 					from '../../../server/src/image-functions/crop.js'
import {
	newGame,
	addPlayer,
	removePlayer,
	addBodyPart,
	setDimensions,
	lockDimensions}		from '../../../server/src/core.js'
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

const [player1, player2, player3] = [1,2,3]
const [head, body] = ['head', 'body']
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

	describe('consequtive calls players', () => {
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


describe('addBodyPart', () => {
	var state, nextState


	beforeEach(function () {
		state = {
			bodies: {1: {}, 2: {}, 3: {}},
			progress: 0,
			level: { current: 1, previous: null, hasChanged: true }
		}
		nextState = addBodyPart(state, body1, head, drawing1)
	})

	describe('body drawing', () => {
		it('has the new drawing', () => {
			assert.equal(nextState.bodies[body1][head], drawing1)
		})
		it('has the new clue drawing', () => {
			const clue = nextState.bodies[body1].clue
			assert.notEqual(nextState.bodies[body1].clue, '')
		})
	})

	describe ('game level for first drawing', () =>{
		it('is not incremented', () => {
			assert.equal(state.level.current, nextState.level.current)
		})
	})

	describe.skip('game level for last drawing', () =>{
		var state, nextState
		beforeEach(function () {
			state = {
				bodies: {1: {}, 2: {}, 3: {}},
				progress: 2,
				level: { current: 1, previous: null, hasChanged: true }
			}
			nextState = addBodyPart(state, body1, head, drawing1)
		})

		it('is incremented', () => {
			assert.equal(state.level.current+1, nextState.level.current)
		})
	})

	describe('game progess', () => {
		it('is incremented', () => {
			assert.equal(nextState.progress, state.progress+1)
		})
	})
})

describe('AddBodyPart makes new level ', () => {
	const [player1, player2, player3] = [1,2,3]
	const head = 'head'
	var nextState = addPlayer(addPlayer(addPlayer({},player1), player2), player3)

	for (let i=1 ; i < 4; i ++){
		nextState = addBodyPart(nextState, i, head, drawing1)
	}

	it('increments level', () => {
		assert(nextState.level.hasChanged)
	})

	it('resets progress', () => {
		assert.equal(nextState.progress, 0)
	})
})

describe('Adding a body part has an effect on state.players', () => {
	const [player1, player2, player3] = [1,2,3]
	const parts = ['head', 'body', 'legs']
	const state = addPlayer(addPlayer(newGame(player1), player2), player3)
	const state1 = addBodyPart(state,  "1", 'head', drawing1)
	const state2 = addBodyPart(state1, "2",'head' , drawing2)
	const state3 = addBodyPart(state2, "3",'head' , drawing3)
	const state4 = addBodyPart(state3, "1",'body' , drawing4)
	const state5 = addBodyPart(state4, "2",'body' , drawing5)
	const state6 = addBodyPart(state5, "3",'body' , drawing6)

	it('does not change the player state after one drawing', () => {
		assert.deepEqual(state.players, state2.players)
	})

	it('does not change the player state after after 2 drawings', () => {
		assert.deepEqual(state1.players, state2.players)
	})

	it('DOES change the player state after after 3 drawings', () => {
		assert.notDeepEqual(state2.players, state3.players)
	})

	it('does not change the player state after 4 drawings', () => {
		assert.deepEqual(state3.players, state4.players)
	})

	it('does not change the player state  after 5 drawings', () => {
		assert.deepEqual(state4.players, state5.players)
	})

	it('does scramble after 6 drawings', () => {
		assert.notDeepEqual(state5.players, state6.players)
	})

	it('has no clue on game begnining', () => {
		expect(state.bodies[1].clue).to.equal('')
	})

	describe('Adding a body part', () => {
		it('after 1 round, updates a body clue value', () =>{
			assert.notEqual(state.bodies[1].clue, state1.bodies[1].clue)
		})

		it('after 2 round, updates a body clue value', () =>{
			assert.notEqual(state1.bodies[2].clue, state2.bodies[2].clue)
		})

		it('after 3 rounds, updates a body clue value', () =>{
			assert.notEqual(state2.bodies[3].clue, state3.bodies[3].clue)
		})

		it('after 4 rounds, updates a body clue value', () =>{
			assert.notEqual(state3.bodies[1].clue, state4.bodies[1].clue)
		})

		it('after 5 rounds, updates a body clue value', () =>{
			assert.notEqual(state4.bodies[2].clue, state5.bodies[2].clue)
		})

		it('after 6 rounds, updates a body clue value', () =>{
			assert.notEqual(state5.bodies[3].clue, state6.bodies[3].clue)
		})

	})

})

describe('After 9 rounds', () => {
	const [player1, player2, player3] = [1,2,3]
	const parts = ['head', 'body', 'legs']
	let state = addPlayer(addPlayer(newGame(player1), player2), player3)
	for(let i = 0; i < 3; i++) {
		for (let k = 1; k < 4; k ++) {
			state = addBodyPart(state, k, parts[i], drawing1)
		}
	}

	for(let i = 1; i < 4; i++) {
		it.skip(`each player has their original drawing back: ${i}: ${JSON.stringify(state.players[i])}`, () => {
			assert.equal(state.players[i].body, i)
		})

		it.skip('each body has a final drawing dataURL string', () => {
			expect(state.bodies[i].final).to.not.be.empty
		})

		it.skip('each final drawing is a valid dataURL string', () => {
			expect(state.bodies[i].final).to.contain('data:image/png;base64,')
		})
	}
})

describe('setDimensions', () => {
		let state = {
			players: {
				1: {}
			}
		}
		let playerId= 1
		let nextState = setDimensions(state, playerId, {height: 123, width: 321})
		const { height, width } = nextState.players[1].dimensions

		it('adds a player\'s phone dimensions to state object', () => {
			assert.equal(height, 123)
			assert.equal(width, 321)
		})
})

