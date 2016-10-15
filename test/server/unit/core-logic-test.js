import fs from 'fs'
import crop 					from '../../../server/src/image-functions/crop.js'
import {
	startGame,
	addPlayer,
	removePlayer,
	addBodyPart}		from '../../../server/src/core.js'
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

describe('Application logic for starting a new game ', () => {
	const playerId = 123
	const newGame = startGame(playerId)
	it('returns a frozen / immutable object', () => {
		assert(Object.isFrozen(newGame), 'it is frozen')
		assert(Object.isFrozen(newGame.bodies), 'it is frozen')
	})

	it('returns an object with "bodies" Object', () => {
		expect(Object.keys(newGame.bodies)).to.have.length(3)
		assert.deepEqual(newGame.bodies, INITIAL_STATE.bodies)
	})

	it('returns a null value for Level ', ()=> {
		expect(newGame.level.current).to.be.null
	})

	it('returns a null value for Level ', ()=> {
		expect(newGame.level.previous).to.be.null
	})

	it('returns a null value for progress because game not started', () =>{
		expect(newGame.progress).to.be.zero
	})

	it('returns a player object, with one player', () => {
		assert.equal(newGame.players.num, 1)
		assert.equal(newGame.players[playerId].body, 1)
	})
})

describe ('Application logic for adding a player', () => {
	const [player1, player2, player3, player4] = [1,2,3,4]
	const state0 = startGame(player1)
	const nextState = addPlayer(state0, player2)

	it('returns a frozen / immutable object', () => {
		assert(Object.isFrozen(nextState), 'it is frozen')
	})

	it('adds a player to the player object', () => {
		assert.equal(nextState.players.num,2)
		expect(nextState.players[player2].body).to.equal(2)
	})

	it('continues to add players', () => {
		let state = addPlayer(state0, player2)
		state = addPlayer(state, player3)
		assert.equal(state.players.num,3)
		expect(state.players[player1].body).to.equal(1)
		expect(state.players[player2].body).to.equal(2)
		expect(state.players[player3].body).to.equal(3)
	})

	it('will stop adding players once three have joined', ()=>{
		let state = addPlayer(state0, player2)
		state = addPlayer(state, player3)
		state = addPlayer(state, player4)

		expect(state.players[player4]).to.be.undefined
	})

	it('starts the level when three players have joined', () => {
		let state = addPlayer(state0, player2)
		state = addPlayer(state, player3)

		assert.equal(state.level.current, 1)
	})
})

describe ('Application logic for removing a player', () => {
	const [player1, player2, player3, player4] = [1,2,3,4]
	const state0 = startGame(player1)
	const nextState = addPlayer(state0, player2)

	//remove player2, game state updated
	it('removes a player from state', () => {
		let stateMinus = removePlayer(nextState, 2)
		assert.deepEqual(stateMinus, state0)
	})
})

describe('AddBodyPart basic logic', () => {
	const [player1, player2, player3] = [1,2,3]
	const body = 1
	const part = 'head'
	const state = addPlayer(addPlayer(startGame(player1), player2), player3)
	const nextState = addBodyPart(state, body, part, drawing1)
	const content = nextState.bodies[body][part]
	const peep = nextState.bodies[body].peep

	describe('The send function', () => {
		it('returns the correct object propertys', () => {
			const data = nextState.send(1)
			assert.equal(data.level, 1)
			expect(data.body.head).to.have.length.above(21)
			expect(data.body.peep).to.have.length.above(21)
		})
	})

	it('updates body with a player\'s drawing', () => {
		expect(content).to.have.length.above(21)
		assert.equal(content, drawing1)
	})

	it('increments the progress', () => {
		assert(nextState.progress)
		assert.equal(nextState.progress, state.progress+1)
	})

	it('doesn\'t increment the level initially', () => {
		assert.equal(state.level.current, nextState.level.current)
	})

	it('generates peep data, and adds is to state', () => {
		expect(peep).to.have.length.above(21)
		assert.notEqual(peep, drawing1)
	})

	it('increments progress to 2', () => {
		const nextState2 = addBodyPart(nextState, body+1, 'body', drawing1)
		assert.equal(nextState2.progress, 2)
	})
})

describe('AddBodyPart makes new level ', () => {
	const [player1, player2, player3] = [1,2,3]
	const body = 1
	const part = 'head'
	var nextState = addPlayer(addPlayer(startGame(player1), player2), player3)

	for (let i=1 ; i < 4; i ++){
		nextState = addBodyPart(nextState, i, part, drawing1)
	}

	it('increments to level 2', () => {
		assert.equal(nextState.level.current, 2)
		assert.equal(nextState.level.previous, 1)
	})

	it('increments progress back to zero', () => {
		assert.equal(nextState.progress, 0)
	})
})

describe('Adding a body part has an effect on state.players', () => {
	const [player1, player2, player3] = [1,2,3]
	const parts = ['head', 'body', 'feet']
	const state = addPlayer(addPlayer(startGame(player1), player2), player3)
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

	it('has no peep on game begnining', () => {
		expect(state.bodies[1].peep).to.equal('')
	})

	describe('Adding a body part', () => {
		it('after 1 round, updates a body peep value', ()=>{
			assert.notEqual(state.bodies[1].peep, state1.bodies[1].peep)
		})

		it('after 2 round, updates a body peep value', ()=>{
			assert.notEqual(state1.bodies[2].peep, state2.bodies[2].peep)
		})

		it('after 3 rounds, updates a body peep value', ()=>{
			assert.notEqual(state2.bodies[3].peep, state3.bodies[3].peep)
		})

		it('after 4 rounds, updates a body peep value', ()=>{
			assert.notEqual(state3.bodies[1].peep, state4.bodies[1].peep)
		})

		it('after 5 rounds, updates a body peep value', ()=>{
			assert.notEqual(state4.bodies[2].peep, state5.bodies[2].peep)
		})

		it('after 6 rounds, updates a body peep value', ()=>{
			assert.notEqual(state5.bodies[3].peep, state6.bodies[3].peep)
		})

	})

})

describe('After 9 rounds', () => {
	const [player1, player2, player3] = [1,2,3]
	const parts = ['head', 'body', 'feet']
	let state = addPlayer(addPlayer(startGame(player1), player2), player3)
	for(let i = 0; i < 3; i++) {
		for (let k = 1; k < 4; k ++) {
			state = addBodyPart(state, k, parts[i], drawing1)
		}
	}

	for(let i = 1; i < 4; i++) {
		it(`each player has their original drawing back: ${i}: ${JSON.stringify(state.players[i])}`, () => {
			assert.equal(state.players[i].body, i)
		})

		it('each body has a final drawing dataURL string', () => {
			expect(state.bodies[i].final).to.not.be.empty
		})

		it('each final drawing is a valid dataURL string', () => {
			expect(state.bodies[i].final).to.contain('data:image/png;base64,')
		})
	}
})