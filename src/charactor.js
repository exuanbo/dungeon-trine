import g, { CANVAS_SIZE, TILE_SIZE } from './globals.js'

class Charactor {
  /**
   * @param {number} frameCount
   */
  static *makeFrameIndexIterator(frameCount) {
    let frameIndex = 0

    for (let i = 0; i < Infinity; i++) {
      if (i % 12 === 0) {
        frameIndex++
        frameIndex %= frameCount
      }

      yield frameIndex
    }
  }

  /**
   * @typedef {Object} Frame
   * @property {{ sx: number, sy: number }} Frame.imageStartPosition
   * @property {number} Frame.count
   */

  /**
   * @typedef {Object} CharactorMeta
   * @property {Object.<string, Frame>} CharactorMeta.frames
   * @property {{ sWidth: number, sHeight: number }} CharactorMeta.imageSize
   * @property {{ dx: number, dy: number }} CharactorMeta.position
   * @property {CanvasRenderingContext2D} ctx
   */

  /**
   * @param {CharactorMeta} charactorMeta
   */
  constructor({ frames, imageSize, position, ctx }) {
    this.sprite = g.assets.image.dungeonTileSet

    this.speed = 2
    this.face = 'right'
    this.directions = { up: false, right: false, down: false, left: false }

    this.lastAction = 'idle'

    this.frames = frames
    this.setFrameIndexIterator()

    this.imageSize = imageSize
    this.position = position
    this.ctx = ctx
  }

  setFrameIndexIterator() {
    this.frameIndexIterator = Charactor.makeFrameIndexIterator(
      this.frames[this.lastAction].count
    )
  }

  getNextFrameImagePosition() {
    const { sx, sy } = this.frames[this.lastAction].imageStartPosition
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
        this.position.dx + this.imageSize.sWidth >= CANVAS_SIZE - TILE_SIZE ||
        this.position.dy <= TILE_SIZE ||
        this.position.dy + this.imageSize.sHeight >= CANVAS_SIZE - TILE_SIZE - 4
      ) {
        this.position = originalPosition
      }
    }
  }

  stopAction() {
    this.lastAction = 'idle'
    this.setFrameIndexIterator()
  }

  render() {
    const { sWidth, sHeight } = this.imageSize

    this.ctx.clearRect(this.position.dx, this.position.dy, sWidth, sHeight)

    this.act()

    const { sx, sy } = this.getNextFrameImagePosition()

    const drawImage = (dx, dy) => {
      this.ctx.drawImage(
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

    if (this.face === 'left') {
      /**
       * {@link https://stackoverflow.com/a/37388113/13346012
       * |How to flip images horizontally with HTML5}
       */
      this.ctx.save()
      this.ctx.translate(
        this.position.dx + sWidth / 2,
        this.position.dy + sHeight / 2
      )
      this.ctx.scale(-1, 1)
      drawImage(-sWidth / 2, -sHeight / 2)
      this.ctx.restore()
    } else {
      drawImage(this.position.dx, this.position.dy)
    }
  }
}

export class Player extends Charactor {
  constructor(ctx) {
    const frames = {
      idle: {
        imageStartPosition: { sx: 128, sy: 100 },
        count: 4
      },
      move: {
        imageStartPosition: { sx: 192, sy: 100 },
        count: 4
      }
    }
    const centerPosition = CANVAS_SIZE / 2 - TILE_SIZE / 2
    super({
      frames,
      imageSize: { sWidth: 16, sHeight: 28 },
      position: { dx: centerPosition, dy: centerPosition },
      ctx
    })
  }

  act() {
    super.act()
  }
}
