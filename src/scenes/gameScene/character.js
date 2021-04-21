import { MovableObject } from '../../engine/index.js'
import { handleCollisionWithWall } from '../utils.js'

/**
 * @typedef {import('../../engine').MovableObjectConfig & {
 *    totalHealth?: number
 *    health?: number
 * }} CharacterConfig
 */

/**
 * @extends {MovableObject<import('./gameLayer').GameLayer>}
 */
export class Character extends MovableObject {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {CharacterConfig} characterConfig
   */
  constructor(layer, { totalHealth = 5, health, ...movableObjectConfig }) {
    super(layer, movableObjectConfig)

    /**
     * Whether the character is user controlled player.
     *
     * Default to `false`.
     *
     * @public
     */
    this.isPlayer = false

    /**
     * The total health of the character.
     *
     * @public
     */
    this.totalHealth = totalHealth

    /**
     * The current health of the character. Default to `totalHealth`.
     *
     * @public
     */
    this.health = health || totalHealth
  }

  /**
   * Move action.
   *
   * Change `face` if turns direction from left to right or from right to left.
   *
   * Stop when about to collide with wall.
   *
   * @override
   * @protected
   */
  move() {
    super.move()

    const animationFrame = this.animation.getCurrentFrame()
    const boundingBox = animationFrame.getBoundingBox(this.position)

    handleCollisionWithWall(
      /* cb */ () => this.restoreToLastPosition(),
      /* gameObjectConfig */ { animationFrame, boundingBox }
    )
  }

  /**
   * Turn `willStop` to `true`
   * and reduce `health` of the character by the passed damage value.
   *
   * Call passed `cb` if `health` is less than `0`.
   *
   * @public
   *
   * @param {number} damage
   * @param {() => void} cb
   */
  takeDamage(damage, cb) {
    this.willStop = true

    this.health -= damage

    if (this.health <= 0) {
      cb()
    }
  }
}

/**
 * @typedef {CharacterConfig & {
 *    attackInterval?: number
 *    damage?: number
 * }} AttackerCharacterConfig
 */

/**
 * `Character` that can attack.
 */
export class AttackerCharacter extends Character {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {AttackerCharacterConfig} attackerCharacterConfig
   */
  constructor(layer, { attackInterval = 60, damage = 1, ...characterConfig }) {
    super(layer, characterConfig)

    this.prioritizedAnimationNames.add('attack')

    this.addAction([
      /* predicate */ () => this.willAttack,
      /* action */ this.attack
    ])

    /**
     * If the character will attack at next `update`.
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
     * `Scene.timer` timeout task id for the last attack.
     *
     * Used for checking if enough time had passed since the last attack.
     *
     * @private
     *
     * @type {number}
     */
    this.attackTimeoutTaskId = undefined

    /**
     * The number of `health` would the attacker cause other to reduce.
     *
     * Default to `1`.
     *
     * @private
     */
    this.damage = damage

    /**
     * Attack interval.
     *
     * The unit is how many times `update` is called. Default to `60`.
     *
     * @private
     */
    this.attackInterval = attackInterval
  }

  /**
   * whether the frames interval between two attacks is less than `attackInterval`
   * by checking if the task with `attackTimeoutTaskId` is done.
   *
   * @private
   */
  isReadyForNextAttack() {
    if (this.attackTimeoutTaskId === undefined) {
      return true
    }

    return this.layer.scene.timer.isTaskDone(
      /* taskId */ this.attackTimeoutTaskId
    )
  }

  /**
   * Attack action.
   *
   * Early return if the character has already attacked before `stop`
   * or `isReadyForNextAttack()` returns `false`.
   *
   * Change `hasAttacked` to `true`.
   *
   * @protected
   *
   * @param {(() => void)=} cb
   */
  attack(cb) {
    if (this.hasAttacked) {
      this.willStop = true
      return
    }

    if (!this.isReadyForNextAttack()) {
      return
    }

    this.setAnimation('attack')

    if (cb !== undefined) {
      cb()
    }

    this.hasAttacked = true
    this.attackTimeoutTaskId = this.layer.scene.timer.setTimeout(
      /* delay */ this.attackInterval
    )
  }

  /**
   * Early return if `hasAttacked` is `true` and `animation.isAllFramesDone` is `false`.
   *
   * Change `hasAttacked` back to `false`.
   *
   * Set animation to `idle`.
   *
   * Change `willStop` back to `false` if succeed.
   *
   * @override
   * @protected
   */
  stop() {
    if (this.hasAttacked && !this.animation.isAllFramesDone) {
      return
    }

    this.hasAttacked = false
    super.stop()
  }
}
