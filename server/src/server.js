import Server from 'socket.io'
import {GAMEMANAGER} from './gamemanager.js'


export const startServer  = () => {
	const io = new Server().attach(process.env.PORT || 3000)

	const gameManager = GAMEMANAGER(io)

	io.on('connection', socket => {
		//console.log(socket.id, 'connected')
		gameManager.add(socket)

		socket.on('action', action => {
			//console.log('\n','******************************  New Socket Action')
			gameManager.play(socket.id, action)
		})

		socket.on('disconnect', function () {
			//console.log(socket.id, 'disconnected')
			gameManager.eject(socket)
	  });
	})

	return io
}

