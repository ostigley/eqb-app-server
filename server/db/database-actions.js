import {helpers} from './database-helpers'

export const doodlehub = (db) => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    createGame: data => {
      return new Promise ( (resolve, reject) => {
        return d.newGameIfRequired(data)
          .then(d.findAnyGame)
          .then(game => {
            return d.addPlayer(data.socket.id, game)
          })
          .then(d.reset)
          .then(resolve)
      })
    }
  }
}