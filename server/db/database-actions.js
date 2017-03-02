import {helpers} from './database-helpers'

export const doodlehub = (db) => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    createOrAddToGame: data => {

      const handleError = e => console.log('Error trying to create or add player to game. database-actions.createoradd',e)

      return new Promise ( (resolve, reject) => {
        d.newGameIfRequired(data)
          .then(d.findAnyGame)
          .then(game => {
            console.log('game',game)
            return d.updateGame(data, game)
          })
          .then(resolve)
          .catch(handleError)
          .then(reject)
      })
    },

    // removePlayer: data => {

    //   const handleError = e => console.log('Error trying to remove player. database-actions.removePlayer',e)

    //   return new Promise( (resolve, reject) => {
    //     return d.updateGame(data)
    //       .then(resolve)
    //       .catch(handleError)
    //       .then(reject)
    //   })
    // },

    updateGame: data => {

      const handleError = e => console.log('Error trying to updateGame. database-actions.updateGame',e)

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