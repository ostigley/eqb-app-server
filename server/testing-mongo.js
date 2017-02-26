import {initializeDoodlehub} from './db/db-config.js'
import {gameController} from './controller/games-controller'


initializeDoodlehub()


const data = {socket: {id: Math.floor(Math.random()*100)}, info: 'Hassan Piker is a little annoying'}

gameController(data).add
