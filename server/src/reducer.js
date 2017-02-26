import {
	newGame,
	addPlayer,
  removePlayer,
	addBodyPart,
  setDimensions,
  startGame} from './core.js'

export default function reducer(state = {}, action) {
  switch(action.type) {
    case('SET_STATE'):
      return Object.assign({}, action.state);
    case('NEW_GAME'):
      return newGame(action.playerId)
    case('ADD_PLAYER'):
      return addPlayer(state, action.playerId, action.gameId)
    case('REMOVE_PLAYER'):
  		return removePlayer(state, action.playerId)
  	case('ADD_DRAWING'):
  		return addBodyPart(state, action.body, action.part, action.drawing)
    case('SET_DIMENSIONS'):
      return setDimensions(state, action.playerId, action.dimensions)
    case('RESET'): //testng only
      return {}
    default:
      return state
  }
}