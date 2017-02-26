import { MongoClient } from 'mongodb'
import  {
  expect,
  assert}         from 'chai'

import {
  initializeTestDoodlehub,
  deleteTestDoodlehub,
  url} from '../init-test-db'

import {INITIAL_STATE} from '../../../server/src/new-game'

import { helpers } from '../../../server/db/database-helpers'

initializeTestDoodlehub()

MongoClient.connect(url, function(err, db) {
  const d = helpers(db)

  describe('Database Helpers', () => {
    describe('#newGameIfRequired', () => {
      it('adds a game if there are no free games', () => {
        d.newGameIfRequired()
          .then(db.collection('freeGames').count)
          .then(count => {
            expect(count).to.eq(1)
          })
          .then(db.collection('activeGames').count)
          .then(count => {
            expect(count).to.eq(1)
          })
          .then(db.reset)
      })

      it('does nothing if there is a freeGame', () => {
        db.collection('freeGames').insertOne({game: {}})
          .then((d.newGameIfRequired))
          .then(db.collection('freeGames').count)
          .then(count => {
            expect(count).to.eq(1)
          })
          .then(db.collection('activeGames').count)
          .then(count => {
            expect(count).to.eq(1)
          })
          .then(db.reset)
      })
    })
  })

})

deleteTestDoodlehub()
