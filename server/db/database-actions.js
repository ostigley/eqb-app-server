// @flow
import {helpers} from './database-helpers'

export const doodlehub : Function = (db : Db) : doodlehub => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    addPlayerToGame: (data) : Promise<void> => {

      const handleError = e => console.error('Error trying to add player to game. database-actions.createoradd',e)

      return new Promise ( (resolve, reject) => {
        d.newGame(data)
          .then(d.findAnyGame)
          .then(game => {
            return d.updateGame(data, game)
          })
          .then(result => {
            data.socket.join(result._id, () => {
              resolve(result)
            })
          })
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })
    },

    updateGame: (data) : Promise<void> => {

      const handleError = e => console.error('Error trying to updateGame. database-actions.updateGame',e)

      return new Promise ((resolve, reject) => {
        return d.updateGame(data)
          .then(result => {
            data.socket.to(result._id).emit('state', result.game)
            resolve(result)
          })
          .catch(handleError)
          .then(reject)
      })

    }
  }
}
