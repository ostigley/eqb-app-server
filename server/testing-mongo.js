import {initializeDoodlehub} from './db/db-config.js'
import {gameController} from './controller/games-controller'


initializeDoodlehub()


const data = () => {
  const num = Math.floor(Math.random()*100)

  return {
    action: {type: 'ADD_PLAYER', playerId: num},
    socket: {id: num},
    info: 'Hassan Piker is a little annoying'
  }
}


gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController(data()).add()
// gameController({socket: {id: 94}}).eject()
