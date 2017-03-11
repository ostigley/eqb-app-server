// @flow
import {doodlehub} from '../db/database-actions'

export const newPlayer : Function = (data) : Function => {

  return (err : Error, db : Db) => {
    if (err) {
      console.log('damn errors', err)
      db.close()
      return
    }

    return doodlehub(db).AddPlayerToGame(data)
      .then( (res) => {
        db.close()
        console.log('closed db')
      })
      .catch(console.error)
      then(db.close)
  }
}

export const removePlayer : Function = (data) : Function => {
  return (err : Error, db : Db) => {
    if (err) {
      console.log('damn errors', err)
      db.close()
      return
    }

    return doodlehub(db).updateGame(data)
      .then( (res) => {
        db.close()
        console.log('closed db')
      })
      .catch((e) => {
        console.error('Game Action removePlayer failed', e)
      })
      then(db.close)
  }
}

export const updateGame : Function = (data) : Function => {
  return (err : Error, db : Db) => {
    if (err) {
      console.log('damn errors', err)
      db.close()
      return
    }

    return doodlehub(db).updateGame(data)
      .then( (res) => {
        db.close()
        console.log('closed db')
      })
      .catch((e) => {
        console.error('Game Action updateGame failed', e)
      })
      then(db.close)
  }
}