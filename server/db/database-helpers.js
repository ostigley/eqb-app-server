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

  const newGameIfRequired = () => {
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
              .catch(console.log)
          } else {
            resolve()
          }
        })
      })
      .catch(console.log)
  }

  const addPlayer = (socketId, game) => {

    const handlError = e => console.log('Error trying to add player. DB helpers addPlayer', e)

    return new Promise ((resolve, reject) => {
      const store = makeStore()
      const actions = [ { type: 'SET_STATE', state: game.game }, { type: 'ADD_PLAYER', playerId: socketId }]
      actions.map(action => store.dispatch(action))
      const state = store.getState()
      const isFull = state.players.num === 3

      return activeGames.findAndModify(
        {_id: game._id},
        {new: true},
        {game: state}
      )
        .then( (err, obj) => {
          if (err.ok !== 1) {console.log('There was an error', err)}
          if (isFull) {
            updateFreeGames(game, 'remove')
              .then(resolve)
              .catch(handlError)
              .then(reject)
          } else {
            resolve()
          }
        })
        .catch(handlError)
        .then(reject)
    })
  }

  const removePlayer = socket => {

    const handlError = e => console.log('Error trying to find game to remove player from', e)

    return new Promise ( (resolve, reject) => {
      activeGames.findOne( { ["game.players."+socket.id] : { $exists : true } } )
        .then(game => {
          const store = makeStore()
          const actions = [{type: 'SET_STATE', state: game.game}, {type: 'REMOVE_PLAYER', playerId: socket.id}]
          actions.map(action => store.dispatch(action))
          const state = store.getState()
          const gameWaiting = state.players.num == 2

          return activeGames.findAndModify(
            {_id: game._id},
            {new: true},
            {game: state}
          )
            .then( (err, obj) => {
              if (err.ok !== 1) {console.log('There was an error', err)}
              if (gameWaiting) {
                updateFreeGames(game, 'add')
                  .then(resolve)
                  .catch(handlError)
                  .then(reject)
              } else {
                resolve()
              }
            })
            .catch(handlError)
            .then(reject)
        })
        .catch(handlError)
        .then(reject)
    })
  }

  // const saveAndUpdateFreeGames = (game, state) => {
  //   return activeGames.findAndModify(
  //     {_id: game._id},
  //     {new: true},
  //     {game: state}
  //   )
  //   .then( (err, obj) => {
  //     if (err.ok !== 1) {console.log('There was an error', err)}
  //     if (isFull) {
  //       updateFreeGames(game, 'add')
  //         .then(resolve)
  //     } else {
  //       resolve()
  //     }
  //   })
  // }

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
    updateFreeGames: updateFreeGames,
    removePlayer: removePlayer
  }

  return helpers
}

















