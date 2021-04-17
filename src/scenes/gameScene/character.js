import { MovableObject } from '../../engine/index.js'
import { data } from '../../data.js'

/**
 * @typedef {import('../../engine').MovableObjectConfig & {
 *    totalHealth?: number
 *    health?: number
 * }} CharacterConfig
 */

export class Character extends MovableObject {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {CharacterConfig} characterConfig
   */
  constructor(layer, { totalHealth = 5, health, ...movableObjectConfig }) {
    super(layer, movableObjectConfig)

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
    const { x: originalX, y: originalY } = this.position

    super.move()

    const currentAnimationFrame = this.animation.getCurrentFrame()

    const hitbox = currentAnimationFrame.getBox(this.position)
    const hitboxActualPosition = hitbox.getActualPosition()

    const { config } = data

    if (
      hitboxActualPosition.x <= config.tileSize ||
      hitboxActualPosition.x + hitbox.width >= config.width - config.tileSize ||
      this.position.y <= config.tileSize ||
      this.position.y + currentAnimationFrame.sprite.height >=
        config.height - config.tileSize - 4
    ) {
      this.position.set(originalX, originalY)
    }
  }

  /**
   * Reduce `health` of the character by the passed damage value.
   *
   * @public
   *
   * @param {number} damage
   */
  takeDamage(damage) {
    this.health -= damage

    if (this.health <= 0) {
      throw new Error('Not implemented.')
    }
  }
}

/**
 * @typedef {CharacterConfig} AttackerCharacterConfig
 */

/**
 * `Character` that can attack.
 */
export class AttackerCharacter extends Character {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {AttackerCharacterConfig} attackerCharacterConfig
   */
  constructor(layer, attackerCharacterConfig) {
    super(layer, /* characterConfig */ attackerCharacterConfig)

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
     * Default attack interval. The unit is how many times `update` is called.
     *
     * @private
     */
    this.attackInterval = 45

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
   * Early return if the character has already attacked before `stop`
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

    if (!this.layer.scene.timer.isTaskDone(/* taskId */ this.attackTaskId)) {
      return
    }

    this.setAnimation('attack')

    this.hasAttacked = true
    this.attackTaskId = this.layer.scene.timer.setTimeout(
      /* delay */ this.attackInterval
    )
  }

  /**
   * Override `Character.stop`.
   *
   * Early return if the animation is not finished.
   *
   * Change `hasAttacked` back to `false`.
   *
   * @override
   * @protected
   */
  stop() {
    if (this.hasAttacked && !this.animation.isAllFramesDone) {
      return
    }

    super.stop()
    this.hasAttacked = false
  }
}
