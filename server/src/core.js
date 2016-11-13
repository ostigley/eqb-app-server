import crop 					from './image-functions/crop.js'
import generateFinal 	from './image-functions/final.js'
import {INITIAL_STATE}from './new-game.js'
import clone					from 'clone'
import deepFreeze 		from 'deep-freeze'

const progress = progress => {
	switch(progress) {
		case(0):
			return 1
		case(1):
			return 2
		default:
			return 0
	}
}


const level = (current, progress) => {
		//progress never gets to 3.  Once at 2, the level increments, and progress is reset.
		return  progress === 2
			? {current: current+1, previous: current, hasChanged: true}
			: {current: current, previous: current, hasChanged: false}
}

const scramble = (state) => {
	let players = Object.assign({}, state.players)
	let ids = Object.keys(players)
	ids.splice(ids.indexOf('num'), 1)//remove num property
	for (let i = 0; i < 3; i++) {
		players[ids[i]] =
			players[ids[i]].body == 3
				? {body: 1}
				: {body: players[ids[i]].body + 1}
	}
	return players
}

export const newGame = (playerId, gameId) => {
	const nextState = clone(INITIAL_STATE)
	nextState.players[playerId] = {body: 1}
	nextState.gameId = gameId
	return deepFreeze(nextState)
}

export const startGame = (state) => {
	let nextState = clone(state)

	if(countDimensions(nextState.players) === 3) {
		state.dimensions = lockDimensions(state.players)
		nextState.level.current = 1
	}

	return deepFreeze(nextState)
}

const countDimensions = players => {
	var count = 0
	for (player in players) {
		player.dimensions ? count++ : null
	}
	count
}


export const addPlayer = (state, playerId, gameId = null) => {
	debugger
	if (Object.keys(state).length == 0) return newGame(playerId, gameId) // is state empty
	if (state.players.num === 3) return Object.freeze(state)
	let nextState = clone(state)
	nextState.players.num++
	const nextPlayer = nextState.players.num
	nextState.players[playerId] = {body: nextPlayer}

	return deepFreeze(nextState)

}

export const removePlayer = (state, playerId) => {
	let nextState = clone(state)
	const nextPlayer = nextState.players.num+1

	nextState.bodies= INITIAL_STATE.bodies
	delete nextState.players[playerId];
	nextState.players.num--

	nextState.level = { current: null, previous: null, hasChanged: true }

	return deepFreeze(nextState)

}

export const addBodyPart = (state, bodyNum, part, drawing) => {
	let nextState = clone(state)
	const cropped = crop(drawing)
	//add drawing data
	nextState.bodies[bodyNum][part] = drawing
	nextState.bodies[bodyNum].clue = cropped

	//update game level and progress
	nextState.progress = progress(state.progress)
	nextState.level = level(state.level.current, state.progress)

	//scramble player body if necessary
	if(nextState.level.current !== state.level.current) {
		nextState.players = scramble(nextState)
	}

	//generate final images if at end of game
	if (nextState.level.current === 4) {
		nextState = generateFinal(nextState)
	}
/*
	let newState= nextState.clone(state)
	const actions = [
	 	addNewDrawing,
	 	incrementProgress,
	 	incrementLevel,
	 	generateFinal
	]
	return actions.reduce( (state, action) => { action(state) }, newState)
*/


	return deepFreeze(nextState)
}

export const setDimensions = (state, playerId, dimensions) => {
	let nextState = clone(state)
	nextState.players[playerId].dimensions = dimensions
	return deepFreeze(nextState)
}

export const lockDimensions = (players) => {
	return {}
}













































