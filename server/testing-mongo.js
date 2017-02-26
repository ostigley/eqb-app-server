import {initializeDoodlehub} from './db/db-config.js'
import {gameController} from './controller/games-controller'


initializeDoodlehub()


const data = () => { return {socket: {id: Math.floor(Math.random()*100)}, info: 'Hassan Piker is a little annoying'} }


// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
// gameController(data()).add
gameController({id: 94}).eject()
