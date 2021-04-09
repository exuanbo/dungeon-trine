import { vector } from './math/vector.js'
import { data } from './data.js'

/**
 * @typedef {Object} CharacterMeta
 * @property {import('./animation').AnimationsMap} animationsMap
 * @property {import('./layer').Layer} layer
 * @property {import('./math/vector').Vector=} position
 */

export class Character {
  /**
   * @param {CharacterMeta} characterMeta
   */
  constructor({
    animationsMap,
    layer,
    position = vector(data.config.canvasSize / 2 - data.config.tileSize / 2)
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
     * {@link Character#actions}
     *
     * @private
     *
     * @type {Set<[predicate: (() => boolean), action: (() => void)]>}
     */
    this._actions = new Set()

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
     * Four directions to move.
     *
     * @public
     *
     * @type {Map<'Up'|'Right'|'Down'|'Left', boolean>}
     */
    this.directions = new Map([
      ['Up', false],
      ['Right', false],
      ['Down', false],
      ['Left', false]
    ])

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
    this.face = 'Right'

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
     * @protected
     */
    this.layer = layer
  }

  /**
   * All the actions to take at each render.
   *
   * An array of tuple `[predicate, action]`.
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
   * Add a pair of `[predicate, action]` to `actions`.
   *
   * @protected
   *
   * @param {[(() => boolean), (() => void)]} predicateActionPair
   */
  addAction(predicateActionPair) {
    this._actions.add(predicateActionPair.map(fn => fn.bind(this)))
  }

  /**
   * Call the actions if their predicates are fulfilled.
   *
   * @private
   */
  act() {
    Array.from(this.actions)
      .reverse()
      .forEach(([predicate, action]) => {
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
    for (const isDirection of this.directions.values()) {
      if (isDirection) {
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

    this.directions.forEach((isDirection, direction) => {
      if (isDirection) {
        switch (direction) {
          case 'Up':
            this.position.y -= this.speed
            break
          case 'Right':
            this.position.x += this.speed
            if (!this.directions.get('Left')) {
              this.face = 'Right'
            }
            break
          case 'Down':
            this.position.y += this.speed
            break
          case 'Left':
            this.position.x -= this.speed
            if (!this.directions.get('Right')) {
              this.face = 'Left'
            }
        }
      }
    })

    const currentAnimationFrame = this.currentAnimation.getCurrentFrame()

    const hitbox = currentAnimationFrame.getBox(this.position)
    const hitboxActualPosition = hitbox.getActualPosition()

    const { canvasSize, tileSize } = data.config

    if (
      hitboxActualPosition.x <= tileSize ||
      hitboxActualPosition.x + hitbox.width >= canvasSize - tileSize ||
      this.position.y <= tileSize ||
      this.position.y + currentAnimationFrame.sprite.height >=
        canvasSize - tileSize - 4
    ) {
      this.position.set(originalX, originalY)
    }
  }

  /**
   * Render the character to the current layer.
   *
   * @public
   */
  render() {
    const currentAnimationFrame = this.currentAnimation.getCurrentFrame()

    this.layer.ctx.clearRect(
      this.position.x,
      this.position.y,
      currentAnimationFrame.sprite.width,
      currentAnimationFrame.sprite.height
    )

    if (this.willStop) {
      this.stop()
    } else {
      this.act()
    }

    const nextAnimationFrame = this.currentAnimation.getNextFrame()

    if (this.face === 'Left') {
      nextAnimationFrame.sprite.renderFlipped(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    } else {
      nextAnimationFrame.sprite.render(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    }
  }

  /**
   * Delete the reference to the current layer.
   *
   * @public
   */
  destroy() {
    this._actions.clear()
    this.layer = null
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
     * The scene timer task id for the last attack.
     * Used for deciding if enough time had passed since the last attack.
     *
     * @private
     *
     * @type {number}
     */
    this.attackTaskId = undefined
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

    if (!this.layer.scene.timer.isTaskDone(this.attackTaskId)) {
      return
    }

    this.setAction('attack')

    this.hasAttacked = true
    this.attackTaskId = this.layer.scene.timer.setTimeout(this.attackInterval)
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
