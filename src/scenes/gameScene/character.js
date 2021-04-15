import { MovableObject } from '../../engine/index.js'
import { data } from '../../data.js'

export class Character extends MovableObject {
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
}

/**
 * Charactor that can attack.
 */
export class AttackerCharacter extends Character {
  /**
   * @param {import('../../engine/layer').Layer} layer
   * @param {{
   *    animationsMap: import('../../engine/gameObjects/animation').AnimationsMap
   *    position: import('../../engine/math/vector').Vector
   * }} attackerCharacterConfig
   */
  constructor(layer, attackerCharacterConfig) {
    super(layer, /* actableObjectConfig */ attackerCharacterConfig)

    this.addAction([
      /* predicate */ () => this.willAttack,
      /* action */ this.attack
    ])

    this.prioritizedAnimationNames.add('attack')

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
    this.attackInterval = 50

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
