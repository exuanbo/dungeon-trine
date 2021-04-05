import { Sprite } from './sprite.js'

/**
 * Animations with their name.
 *
 * @typedef {Object<string, Animation>} AnimationsMap
 */

export class Animation {
  /**
   * Create `<animationName, Animation>` map from provided entries.
   *
   * @public
   * @static
   *
   * @param {HTMLImageElement|HTMLCanvasElement} spriteSheet
   * @param {Array<[
   *    animationName: string,
   *    sx: number,
   *    sy: number,
   *    width: number,
   *    height: number,
   *    frameCount: number,
   *    frameDuration?: number
   * ]>} animationEntries
   */
  static fromEntries(spriteSheet, animationEntries) {
    /** @type {AnimationsMap} */
    const animationsMap = {}

    animationEntries.forEach(
      ([
        animationName,
        sx,
        sy,
        width,
        height,
        frameCount,
        frameDuration = 9
      ]) => {
        animationsMap[animationName] = {}
        animationsMap[animationName].frames = []

        for (let i = 0; i < frameCount; i++) {
          animationsMap[animationName].frames.push(
            new Sprite(spriteSheet, sx + i * width, sy, width, height)
          )
        }

        animationsMap[animationName].frameDuration = frameDuration
      }
    )

    return animationsMap
  }

  /**
   * Generator function to create an iterator for animation frame index.
   *
   * @public
   * @static
   *
   * @param {number} frameCount
   * @param {number} frameDuration
   */
  static *makeFrameIndexIterator(frameCount, frameDuration) {
    let frameIndex = -1
    let isFrameDone = false

    for (let i = 1; i < Infinity; i++) {
      if (i % frameDuration === 0) {
        frameIndex++
        frameIndex %= frameCount
        isFrameDone = true
      } else {
        isFrameDone = false
      }

      yield { frameIndex, isFrameDone }
    }
  }

  /**
   * @param {Sprite[]} frames
   * @param {number} frameDuration
   */
  constructor(frames, frameDuration) {
    /**
     * An array of sprites representing the frames of the animation.
     *
     * @public
     */
    this.frames = frames

    /**
     * Duration per frame. The unit is the rendered time.
     *
     * @public
     */
    this.frameDuration = frameDuration
  }
}
