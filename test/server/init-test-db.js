import { MongoClient } from 'mongodb'

export const url = 'mongodb://localhost:27017/hiddenDoodleTest'

export const initializeTestDoodlehub = (done) => {
  MongoClient.connect(url, function(err, db) {

    const activeGames =  db.collection('activeGames')
    activeGames.createIndex( { gameId: 1 }, (err, result) => {
      if (err) {
        console.error(err)
      }
    })

    db.collection('freeGames')

    db.collection('players')

    db.close()
    done()
  });
}

export const deleteTestDoodlehub = (done) => {
  MongoClient.connect(url, function(err, db) {
    db.dropDatabase()
    .then( () => {
      return db.close()
    })
    .then(done)
  })
}

export const resetDb = (done) => {
  MongoClient.connect(url, (err, db) => {
    db.collection('freeGames').deleteMany({})
      .then(() => {
        db.collection('activeGames').deleteMany({})
      })
      .then(done)
  })
}

