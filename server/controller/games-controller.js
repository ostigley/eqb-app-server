import { MongoClient } from 'mongodb'
import * as actions from './game-actions'
import {url} from '../db/db-config.js'
export const gameController = data => {

  return {
    add: MongoClient.connect(url, actions.newPlayer(data)),
    // eject: MongoClient.connect(url, removePlayer.bind(this)),
    // play: MongoClient.connect(url, updateGame.bind(this)),
  }
}