import { MongoClient } from 'mongodb'

export const url = 'mongodb://localhost:27017/test-hiddenDoodle'

export const initializeTestDoodlehub = () => {
  MongoClient.connect(url, function(err, db) {

    const activeGames =  db.collection('activeGames')
    activeGames.createIndex( { gameId: 1 }, (err, result) => {
      if (!err) {
        console.log('index created')
      }
    })

    db.collection('freeGames')

    db.collection('players')

    db.close()
  });
}

export const deleteTestDoodlehub = () => {
  MongoClient.connect(url, function(err, db) {
    db.dropDatabase()
    db.close()
  })
}

