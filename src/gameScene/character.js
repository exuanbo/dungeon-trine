import { MovableObject } from '../engine/gameObjects/models/movableObject.js'
import { data } from '../data.js'

export class Character extends MovableObject {
  /**
   * Move action.
   *
   * Change `face` if turns direction from left to right or from right to left.
   *
   * Stop when will collide with wall.
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
}

/**
 * Charactor that can attack.
 */
export class AttackerCharacter extends Character {
  /**
   * @param {{
   *    animationsMap: import('../engine/gameObjects/animation').AnimationsMap
   *    position: import('../engine/math/vector').Vector
   *    layer: import('../engine/layer').Layer
   * }} characterMeta
   */
  constructor(characterMeta) {
    super(characterMeta)

    this.addAction([() => this.willAttack, this.attack])

    this.prioritizedActions.add('attack')

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
