import reducer	from '../../../server/src/reducer.js'
import 	{
	expect,
	assert}				from 'chai'
import {
	drawing1,
	drawing2,
	drawing3}			from '../../helpers/test-drawings.js'

	import {
	startGame,
	addPlayer,
	addBodyPart}	from '../../../server/src/core.js'
import {INITIAL_STATE} from '../../../server/src/new-game.js'


const [player1, player2, player3] = [1,2,3]
describe('Reducer START_GAME', () => {
	const action = {type: 'NEW_GAME', playerId: player1}
	const newGame = reducer(null, action)
	it('returns a frozen / immutable object', () => {
		assert(Object.isFrozen(newGame), 'it is frozen')
		assert(Object.isFrozen(newGame.bodies), 'it is frozen')
		assert(Object.isFrozen(newGame.players), 'it is frozen')
		assert(Object.isFrozen(newGame.progress), 'it is frozen')
		assert(Object.isFrozen(newGame.level), 'it is frozen')
	})

	it('returns state object with "bodies" Object', () => {
		expect(Object.keys(newGame.bodies)).to.have.length(3)

		for (let num in newGame.bodies) {
			assert.equal(newGame.bodies[num].head, "")
			assert.equal(newGame.bodies[num].body, "")
			assert.equal(newGame.bodies[num].legs, "")
			assert.equal(newGame.bodies[num].clue, "")
			assert.equal(newGame.bodies[num].final, "")
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
		assert(Object.isFrozen(nextState.bodies), 'it is frozen')
		assert(Object.isFrozen(nextState.players), 'it is frozen')
		assert(Object.isFrozen(nextState.progress), 'it is frozen')
		assert(Object.isFrozen(nextState.level), 'it is frozen')
	})

	it('adds a player to the player object', () => {
		assert.equal(nextState.players.num,2)
		assert(nextState.players[player2])
		expect(nextState.players[player2].body).to.equal(2)
	})

})

describe ('Reducer REMOVE_PLAYER', () => {
	const actions = [
		{type: 'NEW_GAME', playerId: player1},
		{type: 'ADD_PLAYER', playerId: player2},
		{type: 'ADD_PLAYER', playerId: player3},
		{type: 'REMOVE_PLAYER', playerId: player3}

	]
	const nextState = actions.reduce(reducer, {})

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
	const body = 1
	const part = 'head'

	const actions = [
		{type: 'NEW_GAME', playerId: player1},
		{type: 'ADD_PLAYER', playerId: player2},
		{type: 'ADD_PLAYER', playerId: player3},
		{
			type: 'ADD_DRAWING',
			body: body,
			part: part,
			drawing: drawing1
		}
	]
	const nextState = actions.reduce(reducer, {})

	const content = nextState.bodies[body][part]
	const clue = nextState.bodies[body].clue

	it('returns a frozen / immutable object', () => {
		assert(Object.isFrozen(nextState), 'it is frozen')
		assert(Object.isFrozen(nextState.bodies), 'it is frozen')
		assert(Object.isFrozen(nextState.players), 'it is frozen')
		assert(Object.isFrozen(nextState.progress), 'it is frozen')
		assert(Object.isFrozen(nextState.level), 'it is frozen')
	})

	it('updates body with a player\'s drawing', () => {
		expect(content).to.have.length.above(21)
		assert.equal(content, drawing1)
	})

	it('increments the progress', () => {
		assert(nextState.progress)
		assert.equal(nextState.progress, 1)
	})

	it('doesn\'t increment the level initially', () => {
		assert.equal(1, nextState.level.current)
	})

	it('generates clue data, and adds is to state', () => {
		expect(clue).to.have.length.above(21)
		assert.notEqual(clue, drawing1)
	})

	it('increments progress to 2', () => {
		const nextState2 = addBodyPart(nextState, body+1, 'body', drawing1)
		assert.equal(nextState2.progress, 2)
	})
})