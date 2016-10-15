import {GAMEMANAGER} from '../../../server/src/gamemanager.js'
import {assert, expect} from 'chai'
import io 								from 'socket.io-client'
import {startSocket}	 		from '../../../server/src/socket.js'

// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");

// chai.use(chaiAsPromised);

const server = startSocket()

const socketURL = 'http://localhost:3000'

let players = {}

const setup = (io, num) => {
	return new Promise((resolve, reject) => {
		let gameManager = GAMEMANAGER(io)
		for (let i=1; i < num+1; i++ ) {
			let player = io.connect(socketURL, {
				transports: ['websocket'],
				'force new connection': true
			})
			player.on('connect', function() {
				players[i] = player
				gameManager.add(player)
				if (i === num) {
					resolve(gameManager)
				}
			})
		}
	})
}

describe('The GAMEMANAGER', function() {
	this.timeout(5000)
	it('returns an object with an add method', (done) => {
		setup(io, 1)
			.then(gameManager => {
				expect(gameManager).to.have.property('add')
				expect(gameManager.add).to.be.a('function')
				done()
			})
	})
})

describe('Adding 3 players', function() {
	this.timeout(5000)
	it('adds players 1, 2 and 3 to the first game', (done) => {
		setup(io, 3)
			.then(gameManager => {
				let {freeGames, activeGames} = gameManager.print()
				let game1 = activeGames[Object.keys(activeGames)[0]].getState()
				assert.equal(Object.keys(activeGames).length, 1)
				assert.equal(freeGames.length, 0)
				expect(game1.players.num).to.equal(3)
				done()
			})
	})
})

describe('Adding 6 players', function() {
	this.timeout(5000)
	it('adds players 4, 5, and 6 to game 2', (done) => {
		setup(io, 6)
			.then( gameManager => {
				let {freeGames, activeGames} = gameManager.print()
				let game2 = activeGames[Object.keys(activeGames)[1]].getState()
				assert.equal(Object.keys(activeGames).length, 2)
				assert.equal(freeGames.length, 0)
				expect(game2.players.num).to.equal(3)
				done()
			})
	})
})

describe('removing player 6 from a 2 game floor', function() {
	it('puts game2 in to free games array', (done) => {
		setup(io, 6)
			.then(gameManager => {
				let {freeGames, activeGames} = gameManager.print()
				let game2 = activeGames[Object.keys(activeGames)[1]].getState()
				gameManager.eject(players[6])

				expect(freeGames).to.have.length(1)
				done()
			})
	})
})


