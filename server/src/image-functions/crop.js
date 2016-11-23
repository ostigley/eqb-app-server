import Canvas from 'canvas'  //canvas manipulation outside of the browser

const Image = Canvas.Image

export default (drawing, width = 950, height = 300, percentage = 0.9) => {
  let clueData
  let canvas = new Canvas(width, height)
  let ctx = canvas.getContext('2d')

  let imageObj = new Image
  imageObj.src = drawing
  let sx = 0
  let sy = height * percentage
  let sWidth = width
  let sHeight = height * (1-percentage)
  let dx = 0
  let dy = sy
  let dWidth = sWidth;
  let dHeight = sHeight;
  ctx.drawImage(
    imageObj,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    dWidth,
    dHeight)
  clueData = canvas.toDataURL()
  return clueData
}
