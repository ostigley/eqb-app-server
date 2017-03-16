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
  const fakeSocket = {join: () => {}}

  let addPlayerSpy
  let updateGameSpy
  let fakeDatabaseActions
  let doodlehub
  let sandbox

  beforeEach(() => {
    addPlayerSpy = sinon.spy(() => Promise.resolve(fakedbResult))
    updateGameSpy = sinon.spy(() => Promise.resolve(fakedbResult))

    fakeDatabaseActions = {
      addPlayerToGame: addPlayerSpy,
      updateGame: updateGameSpy,
    }
    sandbox = sinon.sandbox.create()
    doodlehub = sandbox.stub(databaseActions, 'doodlehub').returns(fakeDatabaseActions)
  })

  afterEach(() =>sandbox.restore())

  describe('#New Player', () => {

    it('calls the addPlayerToGame database action', () => {
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
    })
  })

  describe('#Remove Player', () => {
    it('calls the updateGame database action with redux remove action', () => {
      const callback = removePlayer()

      callback(null,fakeDb)
      expect(updateGameSpy.called).to.be.true
    })

    it('emits an update to the socket room / game', () => {

    })
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
