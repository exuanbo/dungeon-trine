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
   * @property {{ sx: number, sy: number }} Frame.imagePosition
   * @property {{ sWidth: number, sHeight: number }} Frame.imageSize
   * @property {number} Frame.count
   */

  /**
   * @typedef {Object} CharactorMeta
   * @property {Object.<string, Frame>} CharactorMeta.frames
   * @property {{ dx: number, dy: number }} CharactorMeta.position
   * @property {CanvasRenderingContext2D} ctx
   */

  /**
   * @param {CharactorMeta} charactorMeta
   */
  constructor({ frames, position, ctx }) {
    this.sprite = g.assets.image.dungeonTileSet

    this.speed = 2
    this.face = 'right'
    this.directions = { up: false, right: false, down: false, left: false }

    this.lastAction = 'idle'

    this.frames = frames
    this.setFrameIndexIterator()

    this.position = position
    this.ctx = ctx
  }

  setFrameIndexIterator() {
    this.frameIndexIterator = Charactor.makeFrameIndexIterator(
      this.frames[this.lastAction].count
    )
  }

  /**
   * @param {Frame} currentFrame
   */
  getNextFrame(currentFrame) {
    const { imagePosition, imageSize } = currentFrame
    const nextFrameIndex = this.frameIndexIterator.next().value

    return {
      imagePosition: {
        sx: imagePosition.sx + nextFrameIndex * imageSize.sWidth,
        sy: imagePosition.sy
      },
      imageSize
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

      const { imageSize } = this.frames[this.lastAction]

      if (
        this.position.dx <= TILE_SIZE ||
        this.position.dx + imageSize.sWidth >= CANVAS_SIZE - TILE_SIZE ||
        this.position.dy <= TILE_SIZE ||
        this.position.dy + imageSize.sHeight >= CANVAS_SIZE - TILE_SIZE - 4
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
    const currentFrame = this.frames[this.lastAction]

    this.ctx.clearRect(
      this.position.dx,
      this.position.dy,
      currentFrame.imageSize.sWidth,
      currentFrame.imageSize.sHeight
    )

    this.act()

    const { imagePosition, imageSize } = this.getNextFrame(currentFrame)

    const drawImage = (dx, dy) => {
      this.ctx.drawImage(
        this.sprite,
        imagePosition.sx,
        imagePosition.sy,
        imageSize.sWidth,
        imageSize.sHeight,
        dx,
        dy,
        imageSize.sWidth,
        imageSize.sHeight
      )
    }

    if (this.face === 'left') {
      /**
       * {@link https://stackoverflow.com/a/37388113/13346012
       * |How to flip images horizontally with HTML5}
       */
      this.ctx.save()
      this.ctx.translate(
        this.position.dx + imageSize.sWidth / 2,
        this.position.dy + imageSize.sHeight / 2
      )
      this.ctx.scale(-1, 1)
      drawImage(-imageSize.sWidth / 2, -imageSize.sHeight / 2)
      this.ctx.restore()
    } else {
      drawImage(this.position.dx, this.position.dy)
    }
  }
}

export class Player extends Charactor {
  constructor(ctx) {
    const imageSize = { sWidth: 16, sHeight: 28 }
    const frames = {
      idle: {
        imagePosition: { sx: 128, sy: 100 },
        imageSize,
        count: 4
      },
      move: {
        imagePosition: { sx: 192, sy: 100 },
        imageSize,
        count: 4
      }
    }
    const centerPosition = CANVAS_SIZE / 2 - TILE_SIZE / 2
    super({
      frames,
      position: { dx: centerPosition, dy: centerPosition },
      ctx
    })
  }

  act() {
    super.act()
  }
}
