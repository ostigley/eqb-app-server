import { makeStore }  from '../src/store.js'
import { INITIAL_STATE } from '../src/new-game.js'

export const helpers = db => {
  const activeGames =  db.collection('activeGames')
  const freeGames =  db.collection('freeGames')
  const players =  db.collection('players')

  const findAnyGame = () => {
    return freeGames.findOne({})
      .then( game => {
        return activeGames.findOne(game.game)
      })
  }

  const reset = () => {
    return freeGames.deleteMany({})
      .then(() => {
        return activeGames.deleteMany({})
      })
  }

  const newGameIfRequired = data => {
    return freeGames.count()
    /* count and create game if no games */
      .then(count => {
        return new Promise((resolve, reject) => {
          console.log('count', count)
          if ( !count ) {
            activeGames.insertOne({game: INITIAL_STATE}, {w: 1})
              .then(result => {
                freeGames.insertOne({game: result.insertedId}, {w: 1})
                  .then(resolve)
              })
          } else {
            resolve()
          }
        })
      })
  }

  const addPlayer = (socketId, game) => {
    return new Promise ((resolve, reject) => {
      const store = makeStore()
      const actions = [ { type: 'SET_STATE', state: game.game }, { type: 'ADD_PLAYER', playerId: socketId }]
      actions.map(action => store.dispatch(action))
      const isFull = store.getState().players.num === 3

      return activeGames.findAndModify(
        {_id: game._id},
        {new: true},
        {game: store.getState()}
      )
      .then( (err, obj) => {
        if (err.ok !== 1) {console.log('There was an error', err)}
        if (isFull) {
          updateFreeGames(game, 'remove')
            .then(resolve)
        } else {
          resolve()
        }
      })
    })
  }

  const updateFreeGames = (game, action) => {
    switch(action) {
      case('remove'):
        return freeGames.remove({game: game._id})
      case('add'):
        return freeGames.insertOne(game._id)
    }
  }

  const helpers = {
    findAnyGame: findAnyGame,
    reset: reset,
    newGameIfRequired: newGameIfRequired,
    addPlayer: addPlayer,
    updateFreeGames: updateFreeGames
  }

  return helpers
}

















