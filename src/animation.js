import { Sprite } from './sprite.js'
import { Box } from './math/box.js'
import { vector } from './math/vector.js'
import { data } from './data.js'

/**
 * Animations with their name.
 *
 * @typedef {Object<string, Animation>} AnimationsMap
 */

/**
 * Create `<animationName, Animation>` map from provided animation entries.
 *
 * @param {import('./data').AnimationEntries} animationEntries
 */
export const makeAnimationsMap = animationEntries => {
  /** @type {AnimationsMap} */
  const animationsMap = {}

  for (const animationName in animationEntries) {
    const animationEntry = animationEntries[animationName]

    const spriteSheet = data.assets.spriteSheets[animationEntry.spriteSheet]

    const animationFrames = animationEntry.frames.map(frame => {
      /** @type {Box|undefined} */
      let box

      if (frame.box !== undefined) {
        const [boxOffsetX, boxOffsetY, boxWidth, boxHeight] = frame.box

        box = new Box(boxWidth, boxHeight, {
          offset: vector(boxOffsetX, boxOffsetY)
        })
      }

      return new AnimationFrame({
        sprite: new Sprite(spriteSheet, ...frame.sprite),
        box,
        duration: frame.duration
      })
    })

    animationsMap[animationName] = new Animation(animationFrames)
  }

  return animationsMap
}

export class AnimationFrame {
  /**
   * @param {{
   *    sprite: Sprite
   *    box?: Box
   *    duration?: number
   * }}
   */
  constructor({ sprite, box, duration = 9 }) {
    /**
     * The sprite of the animation frame.
     *
     * @public
     */
    this.sprite = sprite

    /**
     * The hitbox or hurtbox of the animation frame.
     *
     * {@link AnimationFrame#getBox}
     *
     * @private
     */
    this._box =
      box ||
      new Box(this.sprite.width, this.sprite.height, {
        offset: this.sprite.position
      })

    /**
     * The duration of the animation frame. The unit is render time.
     *
     * @public
     */
    this.duration = duration
  }

  /**
   * Get the hitbox or hurtbox of the frame according to the provided position.
   *
   * @public
   *
   * @param {import('./math/vector').Vector} pos
   */
  getBox(pos) {
    this._box.position.set(pos)
    return this._box
  }
}

export class Animation {
  /**
   * Generator function to create an iterator for animation frame index.
   *
   * @public
   * @static
   *
   * @param {number} frameCount
   * @param {number[]} frameDurations An array of number. Each element is the `duration` of the frame corresponding to its index.
   */
  static *makeFrameIndexIterator(frameCount, frameDurations) {
    let frameIndex = 0
    let isFrameDone = false

    for (let i = 1; i < Infinity; i++) {
      if (i % frameDurations[frameIndex] === 0) {
        frameIndex++
        frameIndex %= frameCount
        isFrameDone = true
      } else {
        isFrameDone = false
      }

      /** @type {boolean} */
      const isReset = yield { frameIndex, isFrameDone }
      if (isReset) {
        frameIndex = 0
        isFrameDone = false
        i = 0
      }
    }
  }

  /**
   * @param {AnimationFrame[]} animationFrames
   */
  constructor(animationFrames) {
    /**
     * An array of `AnimationFrame` representing the frames of the animation.
     *
     * @private
     */
    this.frames = animationFrames

    /**
     * Current frame index.
     *
     * Set by `reset` and `getNextFrame`.
     *
     * @private
     */
    this.currentFrameIndex = 0

    /**
     * Animation frame index iterator for the current action.
     *
     * Generated by `Animation.makeFrameIndexIterator`.
     *
     * @private
     */
    this.frameIndexIterator = Animation.makeFrameIndexIterator(
      this.frames.length,
      this.frames.map(frame => frame.duration)
    )

    /**
     * {@link Animation#isCurrentFrameDone}
     *
     * @private
     */
    this._isCurrentFrameDone = false
  }

  /**
   * If the current frame has lasted enough time according to `frameDuration`.
   *
   * Changed by `reset` and `getNextFrame`.
   *
   * @public
   * @readonly
   */
  get isCurrentFrameDone() {
    return this._isCurrentFrameDone
  }

  /**
   * Reset `currentFrameIndex`, `frameIndexIterator` and `isCurrentFrameDone`.
   *
   * @public
   */
  reset() {
    this.currentFrameIndex = 0
    this.frameIndexIterator.next(true)
    this._isCurrentFrameDone = false
  }

  /**
   * Get current frame according to `currentFrameIndex`.
   *
   * @public
   */
  getCurrentFrame() {
    return this.frames[this.currentFrameIndex]
  }

  /**
   * Get next animation frame according to the next frame index returned by `frameIndexIterator`.
   *
   * @public
   */
  getNextFrame() {
    const { frameIndex, isFrameDone } = this.frameIndexIterator.next().value

    if (isFrameDone) {
      this.currentFrameIndex = frameIndex
    }
    this._isCurrentFrameDone = isFrameDone

    return this.getCurrentFrame()
  }
}
