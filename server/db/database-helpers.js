import _ from 'lodash'
import { makeStore }  from '../src/store.js'
import { INITIAL_STATE } from '../src/new-game.js'

export const helpers = db => {
  const activeGames =  db.collection('activeGames')
  const freeGames =  db.collection('freeGames')
  const players =  db.collection('players')

  const findAnyGame = () => {

    const handlError = e => console.log('Error findAnyGame', e)
    return new Promise((resolve, reject) => {
      freeGames.findOne({})
        .then( game => {
          activeGames.findOne(game.game)
          .then(game => {
            resolve(game)})
          .catch(handlError)
          .then(reject)
        })
    })
  }

  const reset = () => {
    return freeGames.deleteMany({})
      .then(() => {
        return activeGames.deleteMany({})
      })
  }

  const newGameIfRequired = () => {
    const handlError = e => console.log('Error newGameIfRequired', e)
    return new Promise((resolve, reject) => {
      freeGames.count()
    /* count and create game if no games */
      .then(count => {
        console.log('count',count)
        if ( !count ) {
          activeGames.insertOne({game: INITIAL_STATE}, {w: 1})
            .then(result => {
              freeGames.insertOne({game: result.insertedId}, {w: 1})
                .then(resolve)
                .catch(handlError)
                .then(reject)
            })
            .catch(handlError)
            .then(reject)
        } else {
          resolve()
        }
      })
    })
  }

  // const addPlayer = (socketId, game) => {

  //   const handlError = e => console.log('Error trying to add player. DB helpers addPlayer', e)

  //   return new Promise ((resolve, reject) => {
  //     const store = makeStore()
  //     const actions = [ { type: 'SET_STATE', state: game.game }, { type: 'ADD_PLAYER', playerId: socketId }]
  //     actions.map(action => store.dispatch(action))
  //     const state = store.getState()
  //     const isFull = state.players.num === 3

  //     return activeGames.findAndModify(
  //       {_id: game._id},
  //       {new: true},
  //       {game: state}
  //     )
  //       .then( (err, obj) => {
  //         if (err.ok !== 1) {console.log('There was an error', err)}
  //         if (isFull) {
  //           updateFreeGames(game, 'remove')
  //             .then(resolve)
  //             .catch(handlError)
  //             .then(reject)
  //         } else {
  //           resolve()
  //         }
  //       })
  //       .catch(handlError)
  //       .then(reject)
  //   })
  // }

  // const removePlayer = socket => {

  //   const handlError = e => console.log('Error trying to find game to remove player from', e)

  //   return new Promise ( (resolve, reject) => {
  //     activeGames.findOne( { ["game.players."+socket.id] : { $exists : true } } )
  //       .then(game => {
  //         const store = makeStore()
  //         const actions = [{type: 'SET_STATE', state: game.game}, {type: 'REMOVE_PLAYER', playerId: socket.id}]
  //         actions.map(action => store.dispatch(action))
  //         const state = store.getState()
  //         const gameWaiting = state.players.num == 2

  //         return activeGames.findAndModify(
  //           {_id: game._id},
  //           {new: true},
  //           {game: state}
  //         )
  //           .then( (err, obj) => {
  //             if (err.ok !== 1) {console.log('There was an error', err)}
  //             if (gameWaiting) {
  //               updateFreeGames(game, 'add')
  //                 .then(resolve)
  //                 .catch(handlError)
  //                 .then(reject)
  //             } else {
  //               resolve()
  //             }
  //           })
  //           .catch(handlError)
  //           .then(reject)
  //       })
  //       .catch(handlError)
  //       .then(reject)
  //   })
  // }

  const updateGame = (data, game) => {

    const handlError = e => console.log('Error trying to updateGame', e)
    return new Promise ((resolve, reject) => {
      if (game) {
        const newState = generateNewState(game.game, data.action)
        //generate new state and save to db. then resolve
        activeGames.findAndModify(
          {_id: game._id},
          {new: true},
          {game: newState}
        )
        .then( (err, obj) => {
          if (err.ok !== 1) {console.log('There was an error', err); reject()}

          const prevPlayers = game.game.players.num
          const players = newState.players.num
          if (players === 3) {
            console.log('players 3')
            updateFreeGames(game, 'remove')
              .then(resolve)
              .catch(handlError)
              .then(reject)
          } else if (players === 2 && prevPlayers === 3) {
            console.log('players 3 to 2')
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
      } else {

        activeGames.findOne( { ["game.players."+data.socket.id] : { $exists : true } } )
          .then(game => {
            return updateGame(data, game)
          })
          .then(resolve)
          .catch(handlError)
          .then(reject)
      }
    })
  }

  const generateNewState = (state, action) => {
    const store = makeStore()
    const actions = [ { type: 'SET_STATE', state: state }, action ]
    actions.map(action => store.dispatch(action))
    return store.getState()
  }

  const diff = (oldObject, newObject) => {
    return _.transform(newObject, function(result, value, key, collection) {

      console.log('diff', value, key, oldObject)

      if (_.isEqual(value, oldObject[key])) return

      if (typeof value === 'object') {
        return result[key]= diff(value, oldObject[key])
      } else {
        return result[key]= value
      }
    }, {})
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
          .catch(console.log)
      case('add'):
        return freeGames.insertOne({game: ObjectId(game._id)})
          .catch(console.log)
    }
  }

  const helpers = {
    findAnyGame,
    reset,
    newGameIfRequired,
    updateFreeGames,
    updateGame,
  }

  return helpers
}

















