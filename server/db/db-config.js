// @flow
import { MongoClient } from 'mongodb'

export const url : string = 'mongodb://localhost:27017/hiddenDoodle'

export const initializeDoodlehub : Function = () => {
  MongoClient.connect(url, function(err : Error, db : Db) {

    const activeGames : Collection =  db.collection('activeGames')
    activeGames.createIndex( { gameId: 1 }, (err, result) => {
      if (!err) {
        console.log('index created')
      }
    })

    db.collection('freeGames')

    db.collection('players')

    db.close();
  });
}

