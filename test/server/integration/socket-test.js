import {
	assert,
	expect
} 												from 'chai'

// Start server
import io 								from 'socket.io-client'
import {startServer}	 		from '../../../server/src/server.js'

const socketURL = 'http://localhost:3000'
startServer()


describe('New players Socket connection new game ', () => {

	it('returns state object featuring player.id, with game state', (done) => {
		const player1 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})
		player1.on('connect', () => {
			const player2 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})

			player2.on('connect', () => {

				player1.on('state', (data) => {
					expect(data).to.have.property('level')
					expect(data).to.have.property('body')
					expect(data).to.have.property('num')
				})

				player2.on('state', (data) => {
					expect(data).to.have.property('level')
					expect(data).to.have.property('body')
					expect(data).to.have.property('num')
				})

				const player3 = io.connect(socketURL, {transports: ['websocket'],'force new connection': true})
				player3.on('connect', () => {
					player3.on('state', (data) => {
						expect(data).to.have.property('level')
						expect(data).to.have.property('body')
						expect(data).to.have.property('num')
						done()
					})
				})
			})
		})
	})
})
