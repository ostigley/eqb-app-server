import Canvas, {Image} from 'canvas'

export default (state) => {
	if (state.level.current < 4) {
		return state
	}
	const { width, height } = largestDimensions(state);
	let nextState = Object.assign({}, state)
	const parts = ['head', 'body', 'legs']

	//generate final images for each body
	for(let i = 1; i<4; i++) {
		let body = nextState.bodies[i]
		let canvas = new Canvas(width, height*3)
		let ctx = canvas.getContext('2d')

		parts.map( (part, x) => {
			let xmageObj = new Image;
			let dx = 0
			let dy = x*height
			imageObj.src = body[part]
			ctx.drawImage(imageObj, dx, dy)
		})
		body.final = canvas.toDataURL()
		nextState.bodies[i] = body
	}

	//generate amalgamated image
	let finalImageHeight = height*3
	let finalImageWidth = width
	let finalCanvas = new Canvas(width, finalImageHeight*3)
	let finalCtx = finalCanvas.getContext('2d')
	let dx = 0
	for(let i = 1; i<4; i++) {
		let dy = finalImageHeight*i - finalImageHeight; /* starting height must be zero */
		let xmageObj = new Image;
		imageObj.src = nextState.bodies[i].final
		finalCtx.drawImage(imageObj, dx, dy, finalImageWidth, finalImageHeight)
	}

	const finalImageAmalgamated = finalCanvas.toDataURL()

	for (let i = 1; i < 4; i++) {
		nextState.bodies[i].final = finalImageAmalgamated
	}

	//add amalgamated image to each body.final

	return nextState
}



const largestDimensions = state => {
	const {players} = state
	const device
	var area = 0
	for (let player in players) {
		if (player !== 'num') {
			let {height, width} = players[player].dimensions
			var nextArea = height * width
			if( nextArea > area) {
				area = nextArea
				device = player
			}
		}
	}

	return players[device].dimensions
}
