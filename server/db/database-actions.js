// @flow
import {helpers} from './database-helpers'

export const doodlehub : Function = (db : Db) : doodlehub => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    AddPlayerToGame: (data) : Promise<void> => {

      const handleError = e => console.error('Error trying to create or add player to game. database-actions.createoradd',e)

      return new Promise ( (resolve, reject) => {
        d.newGame(data)
          .then(d.findAnyGame)
          .then(game => {
            return d.updateGame(data, game)
          })
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })
    },

    // removePlayer: data => {

    //   const handleError = e => console.error('Error trying to remove player. database-actions.removePlayer',e)

    //   return new Promise( (resolve, reject) => {
    //     return d.updateGame(data)
    //       .then(resolve)
    //       .catch(handleError)
    //       .then(reject)
    //   })
    // },

    updateGame: (data) : Promise<void> => {

      const handleError = e => console.error('Error trying to updateGame. database-actions.updateGame',e)

      return new Promise ((resolve, reject) => {
        return d.updateGame(data)
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })

    }
  }
}

// const data = {
//   action: { type: 'REDUCER', data: '123'},
//   socket: socket
// }

