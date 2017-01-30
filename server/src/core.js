import crop 					from './image-functions/crop.js'
import generateFinal 	from './image-functions/final.js'
import {INITIAL_STATE}from './new-game.js'
import clone					from 'clone'
import deepFreeze 		from 'deep-freeze'

export const newGame = (playerId, gameId) => {
	const nextState = clone(INITIAL_STATE)
	nextState.players[playerId] = {body: 1}
	nextState.gameId = gameId
	return deepFreeze(nextState)
}



const countDimensions = players => {
	var count = 0
	for (let player in players) {
		players[player].dimensions ? count++ : null
	}
	return count
}


export const addPlayer = (state, playerId, gameId = null) => {
	if (!state.players) return newGame(playerId, gameId)
	if (state.players.num === 3) return Object.freeze(state)

	let nextState = clone(state)
	nextState.players.num++
	const nextPlayer = nextState.players.num
	nextState.players[playerId] = {body: nextPlayer}

	return deepFreeze(nextState)

}

export const removePlayer = (state, playerId) => {
	let nextState = clone(state)

	nextState.bodies= INITIAL_STATE.bodies

	delete nextState.players[playerId];
	nextState.players.num--

	nextState.level = { current: null, previous: null, hasChanged: true }

	return deepFreeze(nextState)

}

export const addBodyPart = (state, bodyNum, part, drawing) => {
	let nextState = clone(state)
	nextState = addNewDrawing(nextState, bodyNum, part, drawing)

	const actions = [
	 	incrementProgress,
	 	incrementLevel,
	 	scramble,
	 	generateFinal
	]

	return deepFreeze(actions.reduce( (state, action) => action(state), nextState))
}





// //////////////////////////// HELPERS   ///////////////////
const scramble = state => {
	if (state.level.hasChanged) {
		state = clone(state)
		const players = Object.assign({}, state.players)
		const ids = Object.keys(players)
		ids.splice(ids.indexOf('num'), 1)//remove num property
		for (let i = 0; i < 3; i++) {
			players[ids[i]] =
				players[ids[i]].body == 3
					? {body: 1}
					: {body: players[ids[i]].body + 1}
		}
		state.players = players
		return state
	}

	return state
}

export const incrementLevel = state => {
	state = clone(state)
	const {current, previous} = state.level
	const {progress} = state
	state.level = state.progress === 3
		? {current: current+1, previous: current, hasChanged: true }
		: {current: current, previous: current, hasChanged: false }
	return state
}

export const addNewDrawing = (state, bodyNum, part, drawing) => {
	//find the player the drawing belongs to
	const players = state.players
	const ids = Object.keys(players)
	ids.splice(ids.indexOf('num'), 1)//remove num property
	for (let i = 0; i < 3; i++) {
		if (players[ids[i]].body === bodyNum) {
			const player = ids[i]
			const { width, height } = state.players[player].dimensions
		}
	}

	//generate cropped and upadte state

	state = clone(state)
	const cropped = crop(drawing, width, height)
	state.bodies[bodyNum][part] = drawing
	state.bodies[bodyNum].clue = cropped

	return state
}

export const incrementProgress = state => {
	state = clone(state)
	if (state.progress < 3) {
		state.progress++
	} else {
		state.progress = 1
	}

	return state
}

export const setDimensions = (state, playerId, dimensions) => {
	if (!dimensions) return state
	let nextState = clone(state)
	nextState.players[playerId].dimensions = dimensions
	return deepFreeze(startGame(nextState))
}

export const startGame = (state) => {
	if(countDimensions(state.players) === 3) {
		state = clone(state)
		state.level.current = 1
		state.level.hasChanged = true
		return deepFreeze(state)
	}

	return state
}

export const resetLevel = state => {
	nextState = clone(state)
	nextState.level = INITIAL_STATE.level

	return nextState
}

export const resetProgress = state => {
	nextState = clone(state)
	nestState.progress = 0

	return nextState
}



































