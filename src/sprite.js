import { vector } from './vector.js'

/**
 * Sprite frames.
 *
 * @typedef {Object} Frames
 * @property {Sprite[]} Frames.sprites
 * @property {number} Frames.duration
 */

/**
 * Sprite frames with their name.
 *
 * @typedef {Object<string, Frames>} FramesMap
 */

export class Sprite {
  /**
   * Create sprite frames map from provided frame entries.
   *
   * @public
   * @static
   *
   * @param {HTMLImageElement | HTMLCanvasElement} spriteSheet
   * @param {Array<[
   *    frameName: string,
   *    x: number,
   *    y: number,
   *    width: number,
   *    height: number,
   *    frameCount: number,
   *    duration?: number
   * ]>} frameEntries
   */
  static makeFramesMap(spriteSheet, frameEntries) {
    /** @type {FramesMap} */
    const framesMap = {}

    frameEntries.forEach(
      ([frameName, x, y, width, height, frameCount, duration = 9]) => {
        framesMap[frameName] = {}
        framesMap[frameName].sprites = []
        for (let i = 0; i < frameCount; i++) {
          framesMap[frameName].sprites.push(
            new Sprite(spriteSheet, x + i * width, y, width, height)
          )
        }
        framesMap[frameName].duration = duration
      }
    )

    return framesMap
  }

  /**
   * Generator function to create an iterator for sprite frame index.
   *
   * @public
   * @static
   *
   * @param {number} spriteCount
   * @param {number} duration
   */
  static *makeFrameIndexIterator(framesCount, duration) {
    let frameIndex = -1
    let isFrameDone = false

    for (let i = 1; i < Infinity; i++) {
      if (i % duration === 0) {
        frameIndex++
        frameIndex %= framesCount
        isFrameDone = true
      } else {
        isFrameDone = false
      }

      yield { frameIndex, isFrameDone }
    }
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement} spriteSheet
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(spriteSheet, x, y, width, height) {
    /**
     * Sprite sheet for this sprite.
     *
     * @public
     */
    this.spriteSheet = spriteSheet

    /**
     * Image position on the sprite sheet.
     *
     * @public
     */
    this.position = vector(x, y)

    /**
     * Sprite width.
     *
     * @public
     */
    this.width = width

    /**
     * Sprite height.
     *
     * @public
     */
    this.height = height
  }
}
