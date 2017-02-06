import Canvas, {Image} from 'canvas'
export default (state) => {
	if (state.level.current < 4) {
		return state
	}

	const height = 250;
	const width = 500;

	let nextState = Object.assign({}, state)
	const parts = ['head', 'body', 'legs']

	//generate final images for each body
	for(let i = 1; i<4; i++) {
		let body = nextState.bodies[i]
		let canvas = new Canvas(width, height*3)
		let ctx = canvas.getContext('2d')

		parts.map( (part, x) => {
			let imageObj = new Image;
			let dx = 0
			let dy = x*height
			imageObj.onload = () => {
				ctx.drawImage(imageObj, dx, dy, width, height)
			}
			imageObj.src = body[part]
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
		let imageObj = new Image;
		imageObj.onload = () => {
			finalCtx.drawImage(imageObj, dx, dy, finalImageWidth, finalImageHeight)
		}
		imageObj.src = nextState.bodies[i].final
	}

	const finalImageAmalgamated = finalCanvas.toDataURL()

	for (let i = 1; i < 4; i++) {
		nextState.bodies[i].final = finalImageAmalgamated
	}
	//add amalgamated image to each body.final

	return nextState
}

