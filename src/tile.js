import g, { TILE_SIZE } from './globals.js'

class Tile {
  constructor({
    imagePosition,
    imageSize = { sWidth: TILE_SIZE, sHeight: TILE_SIZE },
    position
  }) {
    this.sprite = g.assets.image.dungeonTileSet

    this.isWall = false

    this.imagePosition = imagePosition
    this.imageSize = imageSize
    this.position = position
  }

  isContaining({ position, imageSize }) {
    if (this.isWall) {
      return false
    }

    const { dx: x1, dy: y1 } = this.position
    const { sWidth: w1, sHeight: h1 } = this.imageSize

    const { dx: x2, dy: y2 } = position
    const { sWidth: w2, sHeight: h2 } = imageSize

    return (
      ((x2 < x1 && x2 + w2 > x1) || (x2 > x1 && x2 < x1 + w1) || x2 === x1) &&
      ((y2 < y1 && y2 + h2 > y1) || (y2 > y1 && y2 < y1 + h1) || y2 === y1)
    )
  }

  draw() {
    const { sx, sy } = this.imagePosition
    const { sWidth, sHeight } = this.imageSize
    const { dx, dy } = this.position

    g.ctx.clearRect(dx, dy, sWidth, sHeight)
    g.ctx.drawImage(
      this.sprite,
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      sWidth,
      sHeight
    )
  }
}

export class Floor extends Tile {
  constructor({ position }) {
    // floor_1
    super({ imagePosition: { sx: 16, sy: 64 }, position })
  }
}

export class Wall extends Tile {
  constructor({ imagePosition, imageSize, position }) {
    super({ imagePosition, imageSize, position })
    this.isWall = true
  }
}
