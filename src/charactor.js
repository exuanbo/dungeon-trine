import { CTX, WIDTH, HEIGHT, SPRITE, TILE_SIZE } from './globals.js'

class Charactor {
  static *makeFrameIndexIterator(frameCount) {
    let frameIndex = 0

    for (let i = 0; i < Infinity; i++) {
      if (i % 10 === 0) {
        frameIndex++
        frameIndex %= frameCount
      }

      yield frameIndex
    }
  }

  constructor({ frames, imageSize, position, tiles }) {
    this.speed = 2
    this.face = 'right'
    this.directions = { up: false, right: false, down: false, left: false }

    this.lastAction = 'idle'

    this.frames = frames
    this.setFrameIndexIterator()

    this.imageSize = imageSize
    this.position = position
    this.tiles = tiles
    this.surroundingTiles = this.getSurroundingTiles()
  }

  setFrameIndexIterator() {
    this.frameIndexIterator = Charactor.makeFrameIndexIterator(
      this.frames[this.lastAction].count
    )
  }

  getSurroundingTiles() {
    return this.tiles.filter(tile => tile.isContaining(this))
  }

  getNextFrameImagePosition() {
    const { sx, sy } = this.frames[this.lastAction].startImagePosition
    const nextFrameIndex = this.frameIndexIterator.next().value

    return {
      sx: sx + nextFrameIndex * this.imageSize.sWidth,
      sy
    }
  }

  act() {
    const { up, right, down, left } = this.directions
    if (up || right || down || left) {
      const originalPosition = { ...this.position }

      if (up) {
        this.position.dy -= this.speed
      }
      if (right) {
        this.position.dx += this.speed
        if (!left) {
          this.face = 'right'
        }
      }
      if (down) {
        this.position.dy += this.speed
      }
      if (left) {
        this.position.dx -= this.speed
        if (!right) {
          this.face = 'left'
        }
      }

      if (this.lastAction !== 'move') {
        this.lastAction = 'move'
        this.setFrameIndexIterator()
      }

      if (
        this.position.dx <= TILE_SIZE ||
        this.position.dx + this.imageSize.sWidth >= WIDTH - TILE_SIZE ||
        this.position.dy <= TILE_SIZE ||
        this.position.dy + this.imageSize.sHeight >= HEIGHT - TILE_SIZE - 4
      ) {
        this.position = originalPosition
        return
      }

      this.surroundingTiles = this.getSurroundingTiles()
    }
  }

  stopAction() {
    this.lastAction = 'idle'
    this.setFrameIndexIterator()
  }

  draw() {
    const { sWidth, sHeight } = this.imageSize
    CTX.clearRect(this.position.dx, this.position.dy, sWidth, sHeight)

    const bottomWalls = this.tiles.filter(
      tile =>
        tile.isWall &&
        tile.position.dy + tile.imageSize.sHeight === HEIGHT &&
        this.surroundingTiles.some(
          surroundingTile =>
            surroundingTile.position.dx === tile.position.dx &&
            surroundingTile.position.dy + TILE_SIZE - 4 === tile.position.dy
        )
    )
    this.surroundingTiles.concat(bottomWalls).forEach(tile => {
      tile.draw()
    })

    this.act()

    const { sx, sy } = this.getNextFrameImagePosition()

    const drawImage = (dx, dy) => {
      CTX.drawImage(SPRITE, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight)
    }

    if (this.face === 'left') {
      CTX.save()
      CTX.translate(
        this.position.dx + sWidth / 2,
        this.position.dy + sHeight / 2
      )
      CTX.scale(-1, 1)
      drawImage(-sWidth / 2, -sHeight / 2)
      CTX.restore()
    } else {
      drawImage(this.position.dx, this.position.dy)
    }
  }
}

export class Player extends Charactor {
  constructor({
    position = {
      dx: WIDTH / 2 - TILE_SIZE / 2,
      dy: HEIGHT / 2 - TILE_SIZE / 2
    },
    tiles
  }) {
    const frames = {
      idle: {
        startImagePosition: { sx: 128, sy: 100 },
        count: 4
      },
      move: {
        startImagePosition: { sx: 192, sy: 100 },
        count: 4
      }
    }
    super({ frames, imageSize: { sWidth: 16, sHeight: 28 }, position, tiles })
  }

  act() {
    super.act()
  }
}
