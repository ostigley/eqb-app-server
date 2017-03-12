import _ from 'lodash'
import { makeStore }  from '../src/store.js'
import { INITIAL_STATE } from '../src/new-game.js'

export const helpers = db => {
  const activeGames : Collection =  db.collection('activeGames')
  const freeGames : Collection =  db.collection('freeGames')
  const players : Collection =  db.collection('players')

  const findAnyGame : Function = () : Promise<state> => {

    const handlError = e => console.error('Error findAnyGame', e)
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
        activeGames.deleteMany({})
      })
  }

  const newGame = () => {
    const handlError = e => console.error('Error newGameIfRequired', e)

    return new Promise((resolve, reject) => {
      freeGames.count()
    /* count and create game if no games */
      .then(count => {
        if ( !count ) {
          return activeGames.insertOne({game: INITIAL_STATE}, {w: 1})
            .then(result => {
              return freeGames.insertOne({_id:result.insertedId, game: result.insertedId}, {w: 1})
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
      .catch(handlError)
      .then(reject)
    })
  }

  const updateGame = (data, game) => {

    const handlError = e => console.error('Error trying to updateGame', e)
    return new Promise ((resolve, reject) => {
      if (game) {
        const newState = generateNewState(game.game, data.action)
        //generate new state and save to db. then resolve
        activeGames.findAndModify(
          {_id: game._id},
          [],
          {'$set': {game: newState}},
          {new: true}
        )
        .then( (result) => {
          if (result.ok !== 1) {console.log('There was an error', err); reject()}
            const action = freeGamesAction(game.game, newState)
            if (action) {
              return updateFreeGames(game, action)
                .then(r => {
                  resolve(result.value)
                })
                .catch(handlError)
                .then(reject)
            } else {
              resolve(result.value)
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

  const updateFreeGames = (game, action) => {
    if (action === 'remove') {
        return freeGames.remove({game: game._id}, {justOne: true})
    } else if (action === 'add') {
        return freeGames.insertOne({_id: game._id, game: game._id})
    }

    return
  }

  const freeGamesAction = (oldGame, newGame) => {
    switch(newGame.players.num) {
      case 3:
        return 'remove'
      case 0:
        return 'remove'
    }

    switch(oldGame.players.num) {
      case 0:
        if (newGame.players.num === 1) return
        return 'add'
      case 3:
        return 'add'
    }

    return
  }

  const helpers = {
    findAnyGame,
    reset,
    newGame,
    updateFreeGames,
    updateGame,
  }

  return helpers
}

















