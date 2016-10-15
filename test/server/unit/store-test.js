import {
	expect,
	assert}						from 'chai'
import {makeStore}	from '../../../server/src/store.js'
import {INITIAL_STATE}			from '../../../server/src/new-game.js'
describe('The Store ', () => {
	const store = makeStore()

	it('is a redux store configured with correct reducer', () => {
		assert.deepEqual({}, store.getState())
		store.dispatch({type: 'NEW_GAME', playerId: 1})
	})




})