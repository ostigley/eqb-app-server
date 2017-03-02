import {doodlehub} from '../db/database-actions'

export const newPlayer = data => {

  return (err, db) => {
    if (err) {
      console.log('damn errors', err)
      db.close()
      return
    }

    return doodlehub(db).createOrAddToGame(data)
      .then( (res) => {
        db.close()
        console.log('closed db')
      })
      .catch(console.log)
      then(db.close)
  }
}

export const removePlayer = data => {
  return (err, db) => {
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
        console.log('Game Action removePlayer failed', e)
      })
      then(db.close)
  }
}

export const updateGame = data => {
  return (err, db) => {
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
        console.log('Game Action updateGame failed', e)
      })
      then(db.close)
  }
}