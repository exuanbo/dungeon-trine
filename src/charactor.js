import { Sprite } from './sprite.js'
import { vector } from './vector.js'
import g, { CANVAS_SIZE, TILE_SIZE } from './globals.js'

class Charactor {
  /**
   * @param {number} frameCount
   */
  static *makeFrameIndexIterator(frameCount) {
    if (frameCount === 1) {
      while (true) {
        yield 0
      }
    }

    let frameIndex = 0

    for (let i = 0; i < Infinity; i++) {
      if (i % 9 === 0) {
        frameIndex++
        frameIndex %= frameCount
      }

      yield frameIndex
    }
  }

  /**
   * @typedef {Object} CharactorMeta
   * @property {import('./vector').Vector} CharactorMeta.position
   * @property {Object<string, Sprite[]>} CharactorMeta.frames
   * @property {CanvasRenderingContext2D} ctx
   */

  /**
   * @param {CharactorMeta} charactorMeta
   */
  constructor({ position, frames, ctx }) {
    this.speed = 2
    this.face = 'right'
    this.directions = { up: false, right: false, down: false, left: false }

    this.spriteSheet = g.assets.image.dungeonTileSet
    this.action = 'idle'

    this.position = position

    this.frames = frames
    this.setFrameIndexIterator()

    this.ctx = ctx
  }

  setFrameIndexIterator() {
    this.currentFrameIndex = 0
    this.frameIndexIterator = Charactor.makeFrameIndexIterator(
      this.frames[this.action].length
    )
  }

  getCurrentFrame() {
    return this.frames[this.action][this.currentFrameIndex]
  }

  getNextFrame() {
    /** @type {number} */
    const nextFrameIndex = this.frameIndexIterator.next().value
    this.currentFrameIndex = nextFrameIndex
    return this.frames[this.action][nextFrameIndex]
  }

  act() {
    const { up, right, down, left } = this.directions
    if (up || right || down || left) {
      const originalPosition = { ...this.position }

      if (up) {
        this.position.y -= this.speed
      }
      if (right) {
        this.position.x += this.speed
        if (!left) {
          this.face = 'right'
        }
      }
      if (down) {
        this.position.y += this.speed
      }
      if (left) {
        this.position.x -= this.speed
        if (!right) {
          this.face = 'left'
        }
      }

      if (this.action !== 'move') {
        this.action = 'move'
        this.setFrameIndexIterator()
      }

      const currentFrame = this.getCurrentFrame()

      if (
        this.position.x <= TILE_SIZE ||
        this.position.x + currentFrame.width >= CANVAS_SIZE - TILE_SIZE ||
        this.position.y <= TILE_SIZE ||
        this.position.y + currentFrame.height >= CANVAS_SIZE - TILE_SIZE - 4
      ) {
        this.position = originalPosition
      }
    }
  }

  stopAction() {
    this.action = 'idle'
    this.setFrameIndexIterator()
  }

  render() {
    const currentFrame = this.getCurrentFrame()

    this.ctx.clearRect(
      this.position.x,
      this.position.y,
      currentFrame.width,
      currentFrame.height
    )

    this.act()

    const nextFrame = this.getNextFrame()

    const drawImage = (dx, dy) => {
      this.ctx.drawImage(
        this.spriteSheet,
        nextFrame.position.x,
        nextFrame.position.y,
        nextFrame.width,
        nextFrame.height,
        dx,
        dy,
        nextFrame.width,
        nextFrame.height
      )
    }

    if (this.face === 'left') {
      /**
       * {@link https://stackoverflow.com/a/37388113/13346012
       * |How to flip images horizontally with HTML5}
       */
      this.ctx.save()
      this.ctx.translate(
        this.position.x + nextFrame.width / 2,
        this.position.y + nextFrame.height / 2
      )
      this.ctx.scale(-1, 1)
      drawImage(-nextFrame.width / 2, -nextFrame.height / 2)
      this.ctx.restore()
    } else {
      drawImage(this.position.x, this.position.y)
    }
  }
}

export class Player extends Charactor {
  constructor(ctx) {
    const position = vector(CANVAS_SIZE / 2 - TILE_SIZE / 2)
    const frames = Sprite.makeFrames([
      ['idle', 128, 100, 16, 28, 4],
      ['move', 192, 100, 16, 28, 4]
    ])
    super({ position, frames, ctx })
  }

  act() {
    super.act()
  }
}
