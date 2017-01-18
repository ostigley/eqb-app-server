import Canvas, {Image} from 'canvas'

export default (state, width = 350, height = 900) => {
	if (state.level.current < 4) {
		return state
	}
	let nextState = Object.assign({}, state)
	const parts = ['head', 'body', 'legs']

	for(let i = 1; i<2; i++) {
		const body = nextState.bodies[i]
		const canvas = new Canvas(width, height)
		const ctx = canvas.getContext('2d')

		parts.map( (part, i) => {
			const imageObj = new Image
			const dx = 0
			const dy = i*height/3
			imageObj.src = body[part]
			ctx.drawImage(imageObj, dx, dy)
		})
		body.final = canvas.toDataURL()
		nextState.bodies[i] = body
	}
	return nextState
}