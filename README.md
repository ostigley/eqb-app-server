#A server for Exquisite Bodies app
This is a socket server for an app version of my Exquisite Bodies series of games.

This app will run a socket server, creating a hub for managing drawing data and game information, for Exquisite Bodies.

##Socket Details
The socket server responds to 3 actions.
* Connection
* __Action__
* Disconnection

###__Action__
The client only needs to send drawing data to the server.  
* the body the player has been drawing on
* the body part the player has drawn
* the canvass data converted to data_url string. 

An example of how to do this might be:
```
const sendDrawing = data => {
	const state = store.getState()
	const parts = [null, 'head', 'body', 'feet']

	const action = {
		type: 'ADD_DRAWING',
		body: state.num,
		part: parts[state.level],
		drawing: data
	}
	socket.emit('action', action)
}

sendDrawing(drawing_here)
```
##State Updates From Server
To understand the action above, it will help to understand the data the client _receives_ from the server.   The server sends updates on gamestate, with the ‘state’ keyword.
```
socket.on('state', state => {
	console.log(state)
})
```
will log the following:
```
the state object contains the following data:
{
	body: {
	  body: "",
	  feet: "",
	  final: "",
	  head: "",
	},
	peep: "",
	level: null,
	num: 1
}
```

__Details__:
__Level__
This indicates what stage of the game the players have reached:
null: waiting for players
1: drawing the head
2: drawing the body
3: drawing the feet
4: final image can be displayed

__num__
This is a reference to which body the player is drawing on.  It needs to be sent to the server when updating state, so the server knows which body it is receiving data on.

__body__
The body object contains data of the Exquisite-Body the client is drawing on.   ‘head, body, feet’ are canvass data url strings, containing the image data.
The ‘final’ property will be populated at the end of the game, when three drawings have been stitched together.

__peep__
The peep is the cropped image data, giving the player a peep at what was drawn by the previous player, so they know where to start their own drawing.

