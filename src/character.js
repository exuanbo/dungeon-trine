import { Sprite } from './sprite.js'
import { CANVAS_SIZE, TILE_SIZE } from './globals.js'

/**
 * @typedef {Object} CharacterMeta
 * @property {import('./sprite').FramesMap} CharacterMeta.framesMap
 * @property {import('./vector').Vector} CharacterMeta.position
 * @property {CanvasRenderingContext2D} ctx
 */

class Character {
  /**
   * @param {CharacterMeta} characterMeta
   */
  constructor({ framesMap, position, ctx }) {
    /**
     * Sprite Frames for the current action.
     *
     * Set by `setCurrentFrames`.
     *
     * @private
     *
     * @type {import('./sprite').Frames}
     */
    this.currentFrames = undefined

    /**
     * Current sprite index in the frames.
     *
     * Set by `setCurrentFrames` and `getNextFrameSprite`.
     *
     * @private
     *
     * @type {number}
     */
    this.currentFrameIndex = undefined

    /**
     * If the current sprite frame has lasted enough time according to `Frames.duration`.
     *
     * If true, `currentFrameIndex` would change at next render.
     *
     * Set by `setCurrentFrames` and `getNextFrameSprite`.
     *
     * @private
     *
     * @type {boolean}
     */
    this.isCurrentFrameDone = undefined

    /**
     * Sprite frame index iterator for the current action.
     *
     * Generated by `Sprite.makeFrameIndexIterator`. Set by `setCurrentFrames`.
     *
     * @private
     *
     * @generator
     */
    this.frameIndexIterator = undefined

    /**
     * If the character will stop to `idle` at next render.
     *
     * Set back to false in `stop`.
     *
     * @public
     */
    this.willStop = false

    /**
     * All the actions to take.
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
     * The actual action name. Default is `idle`.
     *
     * @private
     */
    this._action = 'idle'

    /**
     * Action name in it will be prioritized if other action has been set.
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
    this.actualFramesPast = 0

    /**
     * The provided frames map.
     *
     * @private
     */
    this.framesMap = framesMap

    this.setCurrentFrames()

    /**
     * Current position in the layer. Default value is set by argument.
     *
     * @protected
     */
    this.position = position

    /**
     * Canvas context for rendering.
     *
     * @private
     */
    this.ctx = ctx
  }

  /**
   * Add action predicate and action function to `allActions`.
   *
   * @protected
   *
   * @param {[predicate: (() => boolean), action: (() => void)]} fns
   */
  addAction(fns) {
    this._actions.unshift(fns.map(fn => fn.bind(this)))
  }

  /**
   * Action getter for `_action`.
   *
   * @protected
   */
  get action() {
    return this._action
  }

  /**
   * Set sprite frames according to current action.
   *
   * Should only be called by `setAction`
   *
   * @private
   */
  setCurrentFrames() {
    this.currentFrames = this.framesMap[this.action]
    this.currentFrameIndex = 0
    this.isCurrentFrameDone = false
    this.frameIndexIterator = Sprite.makeFrameIndexIterator(
      this.currentFrames.sprites.length,
      this.currentFrames.duration
    )
  }

  /**
   * Get current frame sprite according to `currentFrameIndex`.
   *
   * @private
   */
  getCurrentFrameSprite() {
    return this.currentFrames.sprites[this.currentFrameIndex]
  }

  /**
   * Get next frame sprite according to the next frame index generated by `frameIndexIterator`.
   *
   * @private
   */
  getNextFrameSprite() {
    const { frameIndex, isFrameDone } = this.frameIndexIterator.next().value

    if (isFrameDone) {
      this.currentFrameIndex = frameIndex
    }
    this.isCurrentFrameDone = isFrameDone

    return this.getCurrentFrameSprite()
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
   * Call the actions if the predicates are fulfilled.
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
   * Action setter.
   *
   * Set the given action if the character has no other actions.
   *
   * `idle` will be interrupted and action in `prioritizedActions` will be prioritized.
   *
   * Return whether the action has been successfully set.
   *
   * @private
   *
   * @param {string} actionName
   * @returns {boolean} isSet
   */
  setAction(actionName) {
    if (
      !this.isCurrentFrameDone &&
      this.action !== 'idle' &&
      !this.prioritizedActions.includes(actionName)
    ) {
      return false
    }

    this._action = actionName
    this.setCurrentFrames()
    return true
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
   * Change `face` if turing direction from left to right or from right to left.
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

    const originalPosition = { ...this.position }

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

    const currentFrameSprite = this.getCurrentFrameSprite()

    if (
      this.position.x <= TILE_SIZE ||
      this.position.x + currentFrameSprite.width >= CANVAS_SIZE - TILE_SIZE ||
      this.position.y <= TILE_SIZE ||
      this.position.y + currentFrameSprite.height >= CANVAS_SIZE - TILE_SIZE - 4
    ) {
      this.position = originalPosition
    }
  }

  /**
   * Render the character to the current layer.
   *
   * Increase `actualFramesPast` by 1 at the end.
   *
   * @public
   */
  render() {
    const currentFrameSprite = this.getCurrentFrameSprite()

    this.ctx.clearRect(
      this.position.x,
      this.position.y,
      currentFrameSprite.width,
      currentFrameSprite.height
    )

    if (this.willStop) {
      this.stop()
    } else {
      this.act()
    }

    const nextFrameSprite = this.getNextFrameSprite()

    const drawImage = (dx, dy) => {
      this.ctx.drawImage(
        currentFrameSprite.spriteSheet,
        nextFrameSprite.position.x,
        nextFrameSprite.position.y,
        nextFrameSprite.width,
        nextFrameSprite.height,
        dx,
        dy,
        nextFrameSprite.width,
        nextFrameSprite.height
      )
    }

    if (this.face === 'left') {
      /**
       * {@link https://stackoverflow.com/a/37388113/13346012
       * |How to flip images horizontally with HTML5}
       */
      this.ctx.save()
      this.ctx.translate(
        this.position.x + nextFrameSprite.width / 2,
        this.position.y + nextFrameSprite.height / 2
      )
      this.ctx.scale(-1, 1)
      drawImage(-nextFrameSprite.width / 2, -nextFrameSprite.height / 2)
      this.ctx.restore()
    } else {
      drawImage(this.position.x, this.position.y)
    }

    this.actualFramesPast++
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
     * Default attack interval. Use `actualFramesPast`.
     *
     * @private
     */
    this.attackInterval = 36

    /**
     * Last time the character attacked. Use `actualFramesPast`.
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
   * Return in advance if the character has already attacted before `stop`
   * or the difference of two attack times is less than `attackInterval`.
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

    if (this.actualFramesPast - this.lastAttack < this.attackInterval) {
      return
    }

    this.setAction('attack')
    this.hasAttacked = true
    this.lastAttack = this.actualFramesPast
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
