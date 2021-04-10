import { BaseObject } from './basicObject.js'

/**
 * @typedef {[predicate: () => boolean, action: () => void]} PredicateActionPair
 */

export class ActableObject extends BaseObject {
  /**
   * @param {{
   *    animationsMap: import('../animation').AnimationsMap
   *    position: import('../../math/vector').Vector
   *    layer: import('../../layer').Layer
   * }} actableObjectMeta
   */
  constructor({ animationsMap, position, layer }) {
    super({ animation: undefined, position, layer })

    /**
     * If the game object will stop to `idle` at next render.
     *
     * Set back to false in `stop`.
     *
     * @public
     */
    this.willStop = false

    /**
     * {@link Character#actions}
     *
     * @private
     *
     * @type {Set<PredicateActionPair>}
     */
    this._actions = new Set()

    /**
     * {@link Character#action}
     *
     * @private
     */
    this._action = 'idle'

    /**
     * Action name in it will be prioritized if other action has already been set.
     *
     * Default value is an empty `Set`.
     *
     * @protected
     *
     * @type {Set<string>}
     */
    this.prioritizedActions = new Set()

    /**
     * The animations map of the game object.
     *
     * @private
     */
    this.animationsMap = animationsMap

    this.setCurrentAnimation()
  }

  /**
   * All the actions to take at each render.
   *
   * A `Set` of tuple `[predicate, action]`.
   *
   * @protected
   * @readonly
   */
  get actions() {
    return this._actions
  }

  /**
   * The actual action name. Default value is `idle`.
   *
   * @protected
   * @readonly
   */
  get action() {
    return this._action
  }

  /**
   * Add a pair of `[predicate, action]` to `actions`.
   *
   * @protected
   *
   * @param {PredicateActionPair} predicateActionPair
   */
  addAction(predicateActionPair) {
    this._actions.add(predicateActionPair.map(fn => fn.bind(this)))
  }

  /**
   * Set animation according to current action.
   *
   * @private
   */
  setCurrentAnimation() {
    this.animation = this.animationsMap[this.action]
    this.animation.reset()
  }

  /**
   * Action setter.
   *
   * Set the given action if the game object has no other actions.
   *
   * `idle` will be interrupted and action in `prioritizedActions` will be prioritized.
   *
   * Return whether the action has been successfully set.
   *
   * @protected
   *
   * @param {string} actionName
   * @returns {boolean} isSet
   */
  setAction(actionName) {
    if (
      !this.animation.isCurrentFrameDone &&
      this.action !== 'idle' &&
      !this.prioritizedActions.has(actionName)
    ) {
      return false
    }

    this._action = actionName
    this.setCurrentAnimation()
    return true
  }

  /**
   * Stop action.
   *
   * Change `willStop` back to `false` if successfully set action to `idle`.
   *
   * @protected
   */
  stop() {
    if (this.action !== 'idle') {
      const isSet = this.setAction('idle')
      if (!isSet) {
        return
      }
    }
    this.willStop = false
  }

  /**
   * Call the actions if their predicates are fulfilled.
   *
   * @private
   */
  act() {
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
   * @override
   * @public
   */
  render() {
    this.clearSprite()

    this.act()

    this.renderSprite()
  }

  /**
   * Clear `actions` and delete the reference to the current layer.
   *
   * @override
   * @public
   */
  destroy() {
    this._actions.clear()
    super.destroy()
  }
}
