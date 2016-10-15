import {
	assert,
	expect,
	Should
} 												from 'chai'
import {
	drawing1,
	drawing2,
	drawing3}								from '../../helpers/test-drawings.js'

// Start server
import io 								from 'socket.io-client'
import {makeStore} 				from '../../../server/src/store.js'
import {startSocket}	 		from '../../../server/src/socket.js'

const store = makeStore()
const socketURL = 'http://localhost:3000'
startSocket(store)
store.dispatch({type: ''})
////////

const should = Should()

const endTest = (player1, player2, player3, done) => {
	player1.emit('action', {type: 'RESET'})
	player1.disconnect()
	player2.disconnect()
	player3.disconnect()
	done()
}

describe('New players Socket connection new game ', () => {

	it('returns state object featuring player.id, with on player', (done) => {
		const player1 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})
		player1.on('connect', () => {
			const player2 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})

			player2.on('connect', () => {

				player1.on('state', (data) => {
					data.should.have.property(level)
					data.should.have.property(body)
					/***********/
					assert.isNotOk(data.level)
					/***********/
				})

				player2.on('state', (data) => {
					data.players.should.have.property('/#'+player2.id)
					/***********/
					assert.equal(data.players.num, 2)
					assert.isNotOk(data.level.previous)
					assert.isNotOk(data.level.current)
					/***********/
				})

				const player3 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})
				player3.on('connect', () => {
					player3.on('state', (data) => {
						data.players.should.have.property('/#'+player3.id)
						/***********/
						assert.equal(data.players.num, 3)
						assert.equal(data.players['/#'+player3.id].body, 3)
						assert.isNotOk(data.level.previous)
						assert.equal(data.level.current,1)
						/***********/
						endTest(player1, player2, player3, done)
					})
				})
			})
		})
	})

	it('adds drawing data, returns peep data', (done) => {

		const handleUpdate = (player) => {
			player.on('state', data => {
				player.state = data
			})
		}

		const options = {transports: ['websocket'],'force new connection': true}
		const player1 = io.connect(socketURL, options)
		handleUpdate(player1)
		player1.on('connect', () => {

			const player2 = io.connect(socketURL, options)
			handleUpdate(player2)
			player2.on('connect', () => {

				const player3 = io.connect(socketURL, options)
				handleUpdate(player3)
				player3.on('connect', () => {
					player3.on('state', data => {
						player3.state = data
						if (data.level.current === 1) {
							player1.emit('action', {type: 'ADD_DRAWING', part:'head', body: 1, drawing: drawing1 })
							player2.emit('action', {type: 'ADD_DRAWING', part:'head', body: 2, drawing: drawing2 })
							player3.emit('action', {type: 'ADD_DRAWING', part:'head', body: 3, drawing: drawing3 })
						}

						if(data.level.current === 2) {
							expect(player3.state.peep[1].head).to.contain('data:image/png;base64,')
							expect(player1.state.peep[2].head).to.contain('data:image/png;base64,')
							expect(player2.state.peep[3].head).to.contain('data:image/png;base64,')
							endTest(player1, player2, player3, done)
						}
					})

				})
			})
		})
	})
})
