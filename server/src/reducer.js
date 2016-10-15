import {
	startGame,
	addPlayer,
  removePlayer,
	addBodyPart} from './core.js'

export default function reducer(state = {}, action) {
  switch(action.type) {
    case('NEW_GAME'):
      return startGame(action.playerId)
    case('ADD_PLAYER'):
      return addPlayer(state, action.playerId, action.gameId)
    case('REMOVE_PLAYER'):
  		return removePlayer(state, action.playerId)
  	case('ADD_DRAWING'):
  		return addBodyPart(state, action.body, action.part, action.drawing)
    case('RESET'): //testng only
      return {}
    default:
      return state
  }
}