import {makeStore}  from '../src/store.js'

export const helpers = db => {
  const activeGames =  db.collection('activeGames')
  const freeGames =  db.collection('freeGames')
  const players =  db.collection('players')

  return {

    findAnyGame: () => {
      return freeGames.findOne({})
        .then( game => {
          return activeGames.findOne(game.game)
        })
    },

    reset: () => {
      return freeGames.deleteMany({})
        .then(() => {
          return activeGames.deleteMany({})
        })
    },

    newGameIfRequired: () => {
      return freeGames.count()
      /* count and create game if no games */
        .then(count => {
          return new Promise((resolve, reject) => {
            if ( !count ) {
              const newGame = {game: makeStore().getState()}
              activeGames.insertOne(newGame, {w: 1})
                .then(result => {
                  freeGames.insertOne({game: result.insertedId}, {w: 1})
                    .then(resolve)
                })
            } else {
              resolve()
            }
          })
        })
    },

  }
}