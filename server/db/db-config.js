import { MongoClient } from 'mongodb'

export const url = 'mongodb://localhost:27017/hiddenDoodle'

export const initializeDoodlehub = () => {
  MongoClient.connect(url, function(err, db) {

    const activeGames =  db.collection('activeGames')
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

