import {helpers} from './database-helpers'

export const doodlehub = (db) => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    createOrAddToGame: data => {

      const handleError = e => console.log('Error trying to create or add player to game. database-actions.createoradd',e)

      return new Promise ( (resolve, reject) => {
        return d.newGameIfRequired(data)
          .then(d.findAnyGame)
          .then(game => {
            return d.addPlayer(data.socket.id, game)
          })
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })
    },

    removePlayer: data => {

      const handleError = e => console.log('Error trying to remove player. database-actions.removePlayer',e)

      return new Promise( (resolve, reject) => {
        return d.removePlayer(data)
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })
    }
  }
}