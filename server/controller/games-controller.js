// @flow
import { MongoClient } from 'mongodb'
import * as actions from './game-controller-callbacks'
import {url} from '../db/db-config.js'

export const gameController : any = (data : any) => {

  return {
    add: () => MongoClient.connect(url, actions.newPlayer(data)),
    eject: () => MongoClient.connect(url, actions.removePlayer(data)),
    play: () => MongoClient.connect(url, actions.updateGame())
  }
}
