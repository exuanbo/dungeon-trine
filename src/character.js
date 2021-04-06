import { vector } from './math/vector.js'
import { CANVAS_SIZE, TILE_SIZE } from './globals.js'

/**
 * @typedef {Object} CharacterMeta
 * @property {import('./animation').AnimationsMap} CharacterMeta.animationsMap
 * @property {import('./layer').Layer} layer
 * @property {import('./math/vector').Vector=} CharacterMeta.position
 */

class Character {
  /**
   * @param {CharacterMeta} characterMeta
   */
  constructor({
    animationsMap,
    layer,
    position = vector(CANVAS_SIZE / 2 - TILE_SIZE / 2)
  }) {
    /**
     * Animation for the current action.
     *
     * Set by `setCurrentAnimation`.
     *
     * @private
     *
     * @type {import('./animation').Animation}
     */
    this.currentAnimation = undefined

    /**
     * If the character will stop to `idle` at next render.
     *
     * Set back to false in `stop`.
     *
     * @public
     */
    this.willStop = false

    /**
     * All the actions to take at each render.
     *
     * An array of tuple `[predicate, action]`.
     *
     * @private
     *
     * @type {Array<[predicate: (() => boolean), action: (() => void)]>}
     */
    this._actions = []

    // Add `move` to `_actions` by default.
    this.addAction([this.willMove, this.move])

    /**
     * {@link Character#action}
     *
     * @private
     */
    this._action = 'idle'

    /**
     * Action name in it will be prioritized if other action has already been set.
     *
     * Default value is an empty array.
     *
     * @protected
     *
     * @type {string[]}
     */
    this.prioritizedActions = []

    /**
     * Moving directions.
     *
     * @public
     */
    this.directions = { up: false, right: false, down: false, left: false }

    /**
     * Default moving speed. Pixels per render.
     *
     * @protected
     */
    this.speed = 2

    /**
     * Which side is the character facing. Sprite would be flipped if facing left.
     *
     * Chanaged by `move`.
     *
     * @private
     */
    this.face = 'right'

    /**
     * The actual rendered times. Used for controlling actions interval.
     *
     * Increased by `render`.
     *
     * @protected
     */
    this.renderedTimes = 0

    /**
     * The provided animations map.
     *
     * @private
     */
    this.animationsMap = animationsMap

    this.setCurrentAnimation()

    /**
     * Current position in the layer. Default value is provided by argument.
     *
     * @protected
     */
    this.position = position

    /**
     * Reference to the current layer.
     *
     * @public
     */
    this.layer = layer
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
   * Set animation according to current action.
   *
   * @private
   */
  setCurrentAnimation() {
    this.currentAnimation = this.animationsMap[this.action]
    this.currentAnimation.reset()
  }

  /**
   * Action setter.
   *
   * Set the given action if the character has no other actions.
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
      !this.currentAnimation.isCurrentFrameDone &&
      this.action !== 'idle' &&
      !this.prioritizedActions.includes(actionName)
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
   * Add a tuple of action predicate and action function to the start of `_actions`.
   *
   * @protected
   *
   * @param {[predicate: (() => boolean), action: (() => void)]} fns
   */
  addAction(fns) {
    this._actions.unshift(fns.map(fn => fn.bind(this)))
  }

  /**
   * Call the actions if their predicates are fulfilled.
   *
   * @private
   */
  act() {
    this._actions.forEach(([predicate, action]) => {
      if (predicate()) {
        action()
      }
    })
  }

  /**
   * If the character will move at next render.
   *
   * Decide by checking whether exists true value in `directions`.
   *
   * @private
   */
  willMove() {
    for (const directionName in this.directions) {
      if (this.directions[directionName]) {
        return true
      }
    }

    return false
  }

  /**
   * Move action.
   *
   * Change `face` if turns direction from left to right or from right to left.
   *
   * Stop when will collide with wall.
   *
   * @private
   */
  move() {
    if (this.action !== 'move') {
      const isSet = this.setAction('move')
      if (!isSet) {
        return
      }
    }

    const { x: originalX, y: originalY } = this.position

    if (this.directions.up) {
      this.position.y -= this.speed
    }
    if (this.directions.right) {
      this.position.x += this.speed
      if (!this.directions.left) {
        this.face = 'right'
      }
    }
    if (this.directions.down) {
      this.position.y += this.speed
    }
    if (this.directions.left) {
      this.position.x -= this.speed
      if (!this.directions.right) {
        this.face = 'left'
      }
    }

    const currentAnimationFrame = this.currentAnimation.getCurrentFrame()

    if (
      this.position.x <= TILE_SIZE ||
      this.position.x + currentAnimationFrame.width >=
        CANVAS_SIZE - TILE_SIZE ||
      this.position.y <= TILE_SIZE ||
      this.position.y + currentAnimationFrame.height >=
        CANVAS_SIZE - TILE_SIZE - 4
    ) {
      this.position.set(originalX, originalY)
    }
  }

  /**
   * Render the character to the current layer.
   *
   * Increase `renderedTimes` by 1 at the end.
   *
   * @public
   */
  render() {
    const currentAnimationFrame = this.currentAnimation.getCurrentFrame()

    this.layer.ctx.clearRect(
      this.position.x,
      this.position.y,
      currentAnimationFrame.width,
      currentAnimationFrame.height
    )

    if (this.willStop) {
      this.stop()
    } else {
      this.act()
    }

    const nextAnimationFrame = this.currentAnimation.getNextFrame()

    if (this.face === 'left') {
      nextAnimationFrame.renderFlipped(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    } else {
      nextAnimationFrame.render(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    }

    this.renderedTimes++
  }
}

/**
 * Charactor that can attack.
 */
export class AttackerCharacter extends Character {
  /**
   * @param {CharacterMeta} characterMeta
   */
  constructor(characterMeta) {
    super(characterMeta)

    this.addAction([() => this.willAttack, this.attack])

    this.prioritizedActions.push('attack')

    /**
     * If the character will attack at next render.
     *
     * @public
     */
    this.willAttack = false

    /**
     * If the character has already attacked once.
     *
     * `attack` sets it to `true` and `stop` sets it back to `false`.
     *
     * @private
     */
    this.hasAttacked = false

    /**
     * Default attack interval. The unit is rendered time.
     *
     * @private
     */
    this.attackInterval = 36

    /**
     * Last time the character attacked. Use `renderedTimes`.
     *
     * @private
     *
     * @type {number}
     */
    this.lastAttack = undefined
  }

  /**
   * Attack action.
   *
   * Return in advance if the character has already attacked before `stop`
   * or the frames interval between two attacks is less than `attackInterval`.
   *
   * Change `hasAttacked` to `true`.
   *
   * @protected
   */
  attack() {
    if (this.hasAttacked) {
      this.willStop = true
      return
    }

    if (this.renderedTimes - this.lastAttack < this.attackInterval) {
      return
    }

    this.setAction('attack')
    this.hasAttacked = true
    this.lastAttack = this.renderedTimes
  }

  /**
   * Override `Character.stop`.
   *
   * Change `hasAttacked` back to false.
   *
   * @override
   * @protected
   */
  stop() {
    super.stop()
    this.hasAttacked = false
  }
}
