import Server from 'socket.io'
import {GAMEMANAGER} from './gamemanager.js'


export const startServer  = () => {
	const io = new Server().attach(3000)

	const gameManager = GAMEMANAGER(io)

	io.on('connection', socket => {
		gameManager.add(socket)

		socket.on('action', action => {
			gameManager.play(socket.id, action)
		})

		socket.on('disconnect', function () {
			console.log(socket.id, 'disconnected')
			gameManager.eject(socket)
	  });
	})

}

