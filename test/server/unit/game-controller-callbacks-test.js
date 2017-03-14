import { MongoClient } from 'mongodb'
import sinon from 'sinon'
import {assert, expect} from 'chai'
import { newPlayer, removePlayer, updateGame } from '../../../server/controller/game-controller-callbacks'
import * as databaseActions from '../../../server/db/database-actions'


describe('Game Actions Test', () => {
  const fakeDb = {
    close: sinon.stub()
  }
  const fakedbResult = {id: '', game: ''}
  const addPlayerSpy = sinon.spy(() => Promise.resolve(fakedbResult))
  const updateGameSpy = sinon.spy(() => Promise.resolve(fakedbResult))

  const fakeDatabaseActions = {
    addPlayerToGame: addPlayerSpy,
    updateGame: updateGameSpy
  }
  let doodlehub
  let sandbox
  describe('#New Player', () => {
    beforeEach(() => {
      sandbox = sinon.sandbox.create()
      doodlehub = sandbox.stub(databaseActions, 'doodlehub').returns(fakeDatabaseActions)
    })

    afterEach(() =>sandbox.restore())

    it('calls the addPlayerToGame database action', () => {
      const fakeSocket = {join: () => {}}
      const callback = newPlayer({socket: fakeSocket})

      callback(null, fakeDb)
      expect(addPlayerSpy.called).to.be.true
    })

    it('adds the player to a socket room with the new game id', () => {
      const join = sinon.spy()
      const socket = {
        join: sinon.stub().returns(join())
      }

      const callback = newPlayer({socket})

      callback(null, fakeDb)
      expect(join.called).to.be.true
      databaseActions.doodlehub.restore()
    })
  })

  describe('#Remove Player', () => {

    it('calls the updateGame database action with redux remove action')

    it('emits an update to the socket room / game')
  })

  describe('#Update Game', () => {

    it('calls the updateGame database action with action received')

    it('emits an update to the socket room / game')

  })
})

const handleFail = (db, e) => {
  console.error('Test Failed or Error: ',e)
  assert(false, e)
  db.close()
}
