import {doodlehub} from '../db/database-actions'

export const newPlayer = data => {

  return (err, db) => {
    if (err) {
      console.log('damn errors', err)
      return
    }

    return doodlehub(db).createGame(data)
      .then( (res) => {
        db.close()
        console.log('closed db')
      })
  }
}