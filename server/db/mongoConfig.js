// import {makeStore}  from '../src/store.js'
// import { Mongoclient } from 'mongodb'
var co = require('co')

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

const url = 'mongodb://localhost:27017/hiddenDoodle'
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  // console.log(db)

  const activeGames =  db.collection('activeGames')
  activeGames.createIndex( { gameId: 1 }, (err, result) => {
    if (!err) {
      console.log('index created')
    }
  })
  const freeGames =  db.collection('freeGames')
  const players =  db.collection('players')

  db.close();
});




const gameManager = socket => {
  this.socket = socket

  return {
    add: MongoClient.connect(url, newPlayer.bind(this)),
    // eject: MongoClient.connect(url, removePlayer.bind(this)),
    // play: MongoClient.connect(url, updateGame.bind(this)),
  }
}

const newPlayer = (err, db) => {
  if (err) {
    console.log('damn errors', err)
    return
  }

  return createGame(db)
    .then( (res) => {
      db.close()
      console.log('closed db')
    })
}

gameManager({}).add


// helpers

const createGame = db => {
  const activeGames =  db.collection('activeGames')
  const freeGames =  db.collection('freeGames')
  const players =  db.collection('players')

  return new Promise ((res, rej) => {

    freeGames.count()
      /* count and create game if no games */
      .then(count => {
        return new Promise((resolve, reject) => {
          if ( !count ) {
            const newGame = {text: 'this is a game'}
            activeGames.insertOne(newGame, {w: 1})
              .then(result => {
                console.log('asdfasdkfas')
                freeGames.insertOne({game: result.insertedId}, {w: 1})
                  .then(() => resolve())
              })
          } else {
            resolve()
          }
        })
      })
      /* add player to game and dispatch */
      .then(() => {
        freeGames.findOne({})
          .then(console.log)
          .then(res)
      })
  })
}



