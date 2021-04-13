import { Box } from '../math/box.js'

export class AnimationFrame {
  /**
   * @param {{
   *    sprite: import('./sprite').Sprite
   *    box?: Box
   *    duration?: number
   * }} animationFrameMeta
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
    this._box = box || new Box(this.sprite.width, this.sprite.height)

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
   * @param {import('../math/vector').Vector} pos
   */
  getBox(pos) {
    this._box.position.copy(pos)
    return this._box
  }
}

/**
 * Animations with their name.
 *
 * @typedef {Object<string, Animation>} AnimationsMap
 */

export class Animation {
  /**
   * Generator function to create an generator object for iterating animation frame index.
   *
   * @public
   * @static
   *
   * @param {number} frameCount
   * @param {number[]} frameDurations An array of number. Each element is the `duration` of the frame corresponding to its index.
   */
  static *createFrameIndexGenerator(frameCount, frameDurations) {
    let frameIndex = 0
    let isFrameDone = false
    let isAllFramesDone = false

    for (let i = 1; i < Infinity; i++) {
      if (i % (frameDurations[frameIndex] + 1) === 0) {
        frameIndex++
        frameIndex %= frameCount
        isFrameDone = true

        if (frameIndex === 0) {
          isAllFramesDone = true
        }
      } else {
        isFrameDone = false
        isAllFramesDone = false
      }

      /** @type {boolean} */
      const isReset = yield { frameIndex, isFrameDone, isAllFramesDone }
      if (isReset) {
        frameIndex = 0
        isFrameDone = false
        isAllFramesDone = false
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
     * Generated by `Animation.createFrameIndexGenerator`.
     *
     * @private
     */
    this.frameIndexGenerator = Animation.createFrameIndexGenerator(
      this.frames.length,
      this.frames.map(frame => frame.duration)
    )

    /**
     * {@link Animation#isCurrentFrameDone}
     *
     * @private
     */
    this._isCurrentFrameDone = false

    /**
     * {@link Animation#isAllFramesDone}
     *
     * @private
     */
    this._isAllFramesDone = false
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
    this.frameIndexGenerator.next(/* isReset */ true)
    this._isCurrentFrameDone = false
  }

  /**
   * If the current frame index is set back to `0`.
   *
   * Changed by `reset` and `getCurrentFrame`.
   *
   * @public
   * @readonly
   */
  get isAllFramesDone() {
    return this._isAllFramesDone
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
    const { frameIndex, isFrameDone, isAllFramesDone } =
      /**
       * @type {{
       *    frameIndex: number,
       *    isFrameDone: boolean
       *    isAllFramesDone: boolean
       * }}
       */
      (this.frameIndexGenerator.next().value)

    if (isFrameDone) {
      this.currentFrameIndex = frameIndex
    }
    this._isCurrentFrameDone = isFrameDone
    this._isAllFramesDone = isAllFramesDone
  }

    return this.getCurrentFrame()
  }
}
