export const CANVAS_SIZE = 320

export const TILE_SIZE = 16

const canvas = document.querySelector('canvas')
canvas.height = canvas.width = CANVAS_SIZE

const g = {
  assets: {},
  ctx: canvas.getContext('2d')
}

export default g
