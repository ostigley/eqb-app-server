import { MongoClient } from 'mongodb'
import sinon from 'sinon'
import {assert, expect} from 'chai'
import { doodlehub } from '../../../server/db/database-actions'
import {
  initializeTestDoodlehub,
  deleteTestDoodlehub,
  resetDb,
  url} from '../init-test-db'

describe('Datbase Actions Test', () => {
  before(initializeTestDoodlehub)
  after(deleteTestDoodlehub)

  describe('#AddPlayerToGame', () => {
  beforeEach(resetDb)

    it('returns the game document the player was added to', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }

        let doodleHub = doodlehub(db)
        const data = {
          socket: {
            id: 1,
            join: (id,cb)=>cb()
          },
          action: {
            type: 'ADD_PLAYER',
            playerId: 1
          }
        }
        doodleHub.addPlayerToGame(data)
          .then(result => {
            expect(result._id).to.be.a.string
            expect(result.game.players.num).to.eq(1)
            expect(result.game.players[data.socket.id]).to.not.be.undefined
          })
          .then(done)
          .catch((db,e) => handleFail(db,e))

      })
    })

    it('adds the player to a socket room with the new game id', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }

        let doodleHub = doodlehub(db)
        const joined = sinon.spy()

        const data = {
          socket: {
            id: 1,
            join: joined
          },
          action: {
            type: 'ADD_PLAYER',
            playerId: 1
          }
        }
        doodleHub.addPlayerToGame(data)
          .then(() => {
            assert(joined.called)
          })
          .then(done)
          .catch((db,e) => handleFail(db,e))

      })
    })
  })

  describe('#updateGame', () => {
    beforeEach(resetDb)

    it('returns the updated game document', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }

        let doodleHub = doodlehub(db)

        const data = {
          socket: {
            id: 1,
            join: (a,b) => b(),
            to: () => ({emit: ()=> {}})
          },
          action: {
            type: 'ADD_PLAYER',
            playerId: 1
          }
        }

        doodleHub.addPlayerToGame(data)
          .then(() => {
            data.action = {
              type: 'SET_STATE',
              state: {hello: 'world', players: {num: 3}},
              playerId: data.socket.id
            }
            return doodleHub.updateGame(data)
          })
          .then(result => {
            expect(result.game).to.deep.eq(data.action.state)
          })
          .then(done)
          .catch((db,e) => handleFail(db,e))
      })
    })

    it('calls socket.to().emit() ', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }

        let doodleHub = doodlehub(db)
        const emit = sinon.spy()
        const emited = sinon.spy()

        const data = {
          socket: {
            id: 1,
            join: (a,b) => b(),
            to: () => ({emit: ()=> emited()})
          },
          action: {
            type: 'ADD_PLAYER',
            playerId: 1
          }
        }

        doodleHub.addPlayerToGame(data)
          .then(() => {
            data.action = {
              type: 'SET_STATE',
              state: {hello: 'world', players: {num: 3}},
              playerId: data.socket.id
            }
            return doodleHub.updateGame(data)
          })
          .then(() => {
            assert(emited.called, 'socket.to was called')
          })
          .then(done)
          .catch((db,e) => handleFail(db,e))
      })
    })
  })
})

const handleFail = (db, e) => {
  console.error('Test Failed or Error: ',e)
  assert(false, e)
  db.close()
}
