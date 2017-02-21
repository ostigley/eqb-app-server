import {helpers} from './database-helpers'

export const doodlehub = (db) => {

  // db helpers
  const d = helpers(db)

  //db actions
  return {
    createGame: data => {
      return new Promise ( (resolve, reject) => {
        console.log('data', data)
        return d.newGameIfRequired()
          .then(d.findAnyGame)
          .then(console.log)  /*do things to state and save it*/
          .then(resolve)
      })
    }
  }
}