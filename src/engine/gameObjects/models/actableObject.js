import { BaseObject } from './basicObject.js'

/**
 * @typedef {[predicate: () => boolean, action: () => void]} PredicateActionPair
 */

export class ActableObject extends BaseObject {
  /**
   * @param {{
   *    animationsMap: import('../animation').AnimationsMap
   *    defaultAnimationName?: string
   *    position: import('../../math/vector').Vector
   *    layer: import('../../layer').Layer
   * }} actableObjectMeta
   */
  constructor({
    animationsMap,
    defaultAnimationName = 'idle',
    position,
    layer
  }) {
    super({ animation: animationsMap[defaultAnimationName], position, layer })

    /**
     * The animations map of the game object.
     *
     * @private
     */
    this.animationsMap = animationsMap

    /**
     * {@link Character#animationName}
     *
     * @private
     */
    this._animationName = defaultAnimationName

    /**
     * Action name in it will be prioritized if other action has already been set.
     *
     * @protected
     *
     * @type {Set<string>}
     */
    this.prioritizedAnimationNames = new Set()

    /**
     * All the actions to take at each render.
     *
     * A `Set` of tuple `[predicate, action]`.
     *
     * @private
     *
     * @type {Set<PredicateActionPair>}
     */
    this.actions = new Set()

    /**
     * If the game object will stop to `idle` at next render.
     *
     * Set back to false in `stop`.
     *
     * @public
     */
    this.willStop = false
  }

  /**
   * The current animation name.
   * Default value is `idle` if no argument `defaultAnimationName` is passed to constructor.
   *
   * @protected
   * @readonly
   */
  get animationName() {
    return this._animationName
  }

  /**
   * Animation setter.
   *
   * Set the animation with the passed animation name if the game object has no other running animation.
   *
   * `idle` will be interrupted and animation in `prioritizedAnimationNames` will be prioritized.
   *
   * Return whether the animation has been successfully set.
   *
   * @protected
   *
   * @param {string} targetAnimationName
   * @returns {boolean} isSet
   */
  setAnimation(targetAnimationName) {
    if (!Object.keys(this.animationsMap).includes(targetAnimationName)) {
      throw new Error(`Animation name '${targetAnimationName}' does not exist.`)
    }

    if (
      !this.animation.isCurrentFrameDone &&
      this.animationName !== 'idle' &&
      !this.prioritizedAnimationNames.has(targetAnimationName)
    ) {
      return false
    }

    this._animationName = targetAnimationName
    this.animation = this.animationsMap[targetAnimationName]
    this.animation.reset()
    return true
  }

  /**
   * Add a pair of `[predicate, action]` to `actions`.
   *
   * @protected
   *
   * @param {PredicateActionPair} predicateActionPair
   */
  addAction(predicateActionPair) {
    this.actions.add(
      /**
       * @type {PredicateActionPair}
       */
      (predicateActionPair.map(fn => fn.bind(this)))
    )
  }

  /**
   * Stop action.
   *
   * Change `willStop` back to `false` if successfully set action to `idle`.
   *
   * @protected
   */
  stop() {
    if (this.animationName !== 'idle') {
      const isSet = this.setAnimation('idle')
      if (!isSet) {
        return
      }
    }
    this.willStop = false
  }

  /**
   * Clear the current animation frame sprite from the current layer
   * and update the current animation frame index.
   *
   * Call `stop` and early return if `willStop` is true.
   *
   * Call the actions if their predicates are fulfilled.
   *
   * @override
   * @public
   */
  update() {
    if (this.isRendered) {
      this.clearSprite()
    }

    this.animation.nextFrame()

    if (this.willStop) {
      this.stop()
      return
    }

    Array.from(this.actions)
      .reverse()
      .forEach(([predicate, action]) => {
        if (predicate()) {
          action()
        }
      })
  }

  /**
   * Render the current animation frame sprite to the current layer.
   *
   * @override
   * @public
   */
  render() {
    this.renderSprite()
  }

  /**
   * Clear `actions` and delete the reference to the current layer.
   *
   * @override
   * @public
   */
  destroy() {
    this.actions.clear()
    super.destroy()
  }
}
