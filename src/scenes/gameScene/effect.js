import { BaseObject } from '../../engine/index.js'
import { handleCollisionWithWall } from '../utils.js'

/**
 * @typedef {import('../../engine').BaseObjectConfig & {
 *    sender: import('./character').Character
 *    damage?: number
 *    callback?: (target: import('./character').Character) => void
 *    once?: boolean
 *    speed?: number
 *    duration: number
 * }} EffectConfig
 */

/**
 * @extends {BaseObject<import('./layers').GameLayer>}
 */
export class Effect extends BaseObject {
  /**
   * @param {import('./layers').GameLayer} layer
   * @param {EffectConfig} effectConfig
   */
  constructor(
    layer,
    {
      sender,
      damage = 0,
      callback,
      once = true,
      speed = 0,
      duration,
      ...baseObjectConfig
    }
  ) {
    super(layer, baseObjectConfig)

    /**
     * Whether the effect is expired according to constructor argument `EffectConfig.duration`.
     *
     * @private
     */
    this.isExpired = false

    /**
     * The sender of the effect.
     *
     * @public
     */
    this.sender = sender

    /**
     * How many `health` would the effect cause other character to reduce.
     *
     * @private
     */
    this.damage = damage

    /**
     * Callback function for the effect target.
     *
     * @private
     */
    this.callback = callback

    /**
     * Whether the effect should be taken only once.
     *
     * @private
     */
    this.once = once

    /**
     * How many pixels will the effect move on each `update`. Default to `0`.
     *
     * @private
     */
    this.speed = speed

    /**
     * `Scene.timer` timeout task id for the effect.
     * Used for cancelling the task.
     *
     * @private
     *
     * @type {number}
     */
    this.effectTimeoutTaskId = this.layer.scene.timer.setTimeout(
      /* cb */ () => {
        this.isExpired = true
        this.destroy()
      },
      /* delay */ duration - 1
    )
  }

  /**
   * Take the effect to the passed `target` and call `destroy`.
   *
   * @public
   *
   * @param {import('./player').Player | import('./monster').Monster} target
   * @param {('Left' | 'Right')=} sourceDirection
   */
  takeEffect(target, sourceDirection) {
    if (this.isExpired) {
      return
    }

    if (this.damage > 0) {
      target.takeDamage(/* damage */ this.damage, sourceDirection)
    }

    if (this.callback !== undefined) {
      this.callback(target)
    }

    if (this.once) {
      this.destroy()
    }
  }

  /**
   * Move the effect at the speed of `speed`.
   *
   * Call `destroy` if it collides with any wall.
   *
   * @private
   */
  move() {
    const vectorMethodName = this.face === 'Left' ? 'substract' : 'add'

    this.position[vectorMethodName](this.speed, 0)

    const animationFrame = this.animation.getCurrentFrame()
    const boundingBox = animationFrame.getBoundingBox(this.position)

    handleCollisionWithWall(
      /* cb */ () => this.destroy(),
      /* gameObjectConfig */ { animationFrame, boundingBox }
    )
  }

  /**
   * Clear the current animation frame sprite from the current layer.
   *
   * Return early and  if `isExpired()` returns `true`.
   *
   * Update the current animation frame index and move if `speed` is greater than `0`.
   *
   * @override
   * @public
   */
  update() {
    if (this.isRendered) {
      this.clearSprite()
    }

    this.animation.nextFrame()

    if (this.speed > 0) {
      this.move()
    }
  }

  /**
   * Render the effect to the layer.
   *
   * @override
   * @public
   */
  render() {
    this.renderSprite()
  }

  /**
   * Cancel the timeout task if `isExpired()` returns `false`.
   *
   * Delete the effect from `GameLayer.effects`.
   *
   * Delete the reference to `sender`, `callback` and `layer`.
   *
   * @override
   * @public
   */
  destroy() {
    if (!this.isExpired) {
      this.layer.scene.timer.clearTimeout(/* taskId */ this.effectTimeoutTaskId)
      this.isExpired = true
    }

    this.layer.effects.delete(this)

    this.sender = null
    this.callback = null

    super.destroy()
  }
}
