import { MongoClient } from 'mongodb'
import  {
  expect,
  assert}         from 'chai'

import {
  initializeTestDoodlehub,
  deleteTestDoodlehub,
  resetDb,
  url} from '../init-test-db'

import { helpers } from '../../../server/db/database-helpers'

describe('Database Helpers', () => {
  const game1 = {
    game : {
      players: {
        num: 1
      }
    },
    _id: 1
  }

  const game2 = {
    game : {
      players: {
        '2': {},
        num: 3
      }
    },
    _id: 2
  }

  // const game3 = {
  //   game : {
  //     players: {
  //       '2': {},
  //       num: 3
  //     }
  //   },
  //   _id: 3
  // }

  before(initializeTestDoodlehub)
  after(deleteTestDoodlehub)

  describe('#newGame', () => {
    beforeEach(resetDb)

    it('adds to free games collection if there are no free games', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)

        d.newGame()
          .then(() => {
            return db.collection('freeGames').count()
              .catch((e) => {
                handleFail(db,e)
              })
          })
          .then(count => {
            expect(count).to.eq(1)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('does not add to free games collection if there is a free game', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        d.newGame() /*add a game*/
          .then(d.newGame) /* try to add another game */
          .then(() => {
            return db.collection('freeGames').count()
          })
          .then(count => {
            expect(count).to.eq(1)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('adds to active games collection if it is a new game', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        d.newGame()
          .then(() => {
            return db.collection('activeGames').count()
          })
          .then(count => {
            expect(count).to.eq(1)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('does not add to active games collection if the freeGame already exists', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        d.newGame()
          .then(d.newGame)
          .then(() => {
            return db.collection('activeGames').count()
          })
          .then(count => {
            expect(count).to.eq(1)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })
  })

  describe('#UpdateFreeGames', () => {
    beforeEach(resetDb)

    it('adds a game to free games collection', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        db.collection('freeGames').count()
          .then((count1) => {
            return d.updateFreeGames(game1, 'add')
              .then(() => {
                return db.collection('freeGames').count()
              })
              .then(count2 => {
                expect(count1).to.not.eq(count2)
                db.close()
              })
              .then(done)
          })
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('removes a game from the free games collection', (done) => {
      MongoClient.connect(url, {}, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        d.updateFreeGames(game1, 'add')
          .then(() => {
            return d.updateFreeGames(game2, 'add')
          })
          .then(() => {
            return db.collection('freeGames').count()
              .catch((e) => {
                handleFail(db,e)
              })
          })
          .then((count1) => {
            return d.updateFreeGames(game1, 'remove')
              .then(() => {
                return db.collection('freeGames').count()
              })
              .then(count2 => {
                expect(count1).to.not.eq(count2)
                return db.collection('freeGames').findOne({game: game1._id})
                  .catch((e) => {
                    handleFail(db,e)
                  })
              })
              .then(result => {
                expect(result).to.be.null
                db.close()
              })
              .then(done)
          })
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })
  })

  describe('#UpdateGame', () => {
    const data = {
      action: {
        type: 'SET_STATE',
        state: {foo: 'hello world', players: {num: 1}}
      },
      socket: {
        id: 2
      }
    }

    beforeEach(resetDb)

    it('updates a game if there is a game provided', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        return db.collection('activeGames').insertOne(game1)
          .then(() => {
            return d.updateGame(data, game1)
          })
          .then(result => {
            const game = result.game
            expect(game.foo).to.deep.eq(data.action.state.foo)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('updates a game if no game is provided', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        const d = helpers(db)
        return db.collection('activeGames').insertOne(game2)
          .then(() => {
            return d.updateGame(data)
          })
          .then(result => {
            const game = result.game
            expect(game.foo).to.deep.eq(data.action.state.foo)
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    it('removes the game from free games collection if it is full', (done) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
          console.error('Error in connection',err)
        }
        data.action.state = game2.game
        const d = helpers(db)
        return db.collection('activeGames').insertOne(game2)
          .then(() => {
            db.collection('freeGames').insertOne({game: game2._id})
          })
          .then(() => {
            return d.updateGame(data)
          })
          .then(() => {
            return db.collection('freeGames').findOne({})
          })
          .then((result) => {
            expect(result).to.be.null
            db.close()
          })
          .then(done)
          .catch((e) => {
            handleFail(db,e)
          })
      })
    })

    // it('removes the game from free games collection if it is empty', (done) => {
    //   MongoClient.connect(url, (err, db) => {
    //     if(err) {
    //       console.error('Error in connection',err)
    //     }

    //     game2.game.players.num = 0

    //     const d = helpers(db)
    //     return db.collection('activeGames').insertOne(game2)
    //       .then(() => {
    //         return d.updateGame(data)
    //       })
    //       .then(() => {
    //         return db.collection('freeGames').findOne({_id: game2._id})
    //       })
    //       .then((result) => {
    //         expect(result).to.be.null
    //         db.close()
    //       })
    //       .then(done)
    //       .catch((e) => {
    //         handleFail(db,e)
    //       })
    //   })
    // })
  })

})

const handleFail = (db, e) => {
  console.error('Test Failed.  Boo',e)
  assert(false, e)
  deleteTestDoodlehub()
}
