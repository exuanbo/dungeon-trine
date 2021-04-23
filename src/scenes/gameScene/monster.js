import { AttackerCharacter } from './character.js'
import { randomInt } from '../../engine/index.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

/**
 * Generate an array of `Monster`.
 *
 * @param {import('./layers').GameLayer} layer
 * @param {{ minAmount?: number, maxAmount: number }} options
 */
export const randomMonsters = (layer, { minAmount = 1, maxAmount }) =>
  Array(randomInt(/* min */ minAmount, /* max */ maxAmount + 1))
    .fill(undefined)
    .map(_ => new [TinyZombie][randomInt(/* min */ 0, /* max */ 1)](layer))

/**
 * @typedef {Omit<
 *    import('./character').AttackerCharacterConfig,
 *    'defaultAnimationName' | 'position'
 * > & {
 *    score?: number
 *    collisionDamage?: number
 * }} MonsterConfig
 */

export class Monster extends AttackerCharacter {
  /**
   * @param {import('./layers').GameLayer} layer
   * @param {MonsterConfig} monsterConfig
   */
  constructor(
    layer,
    { score = 10, collisionDamage = 0.5, ...attackerCharacterConfig }
  ) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        defaultAnimationName: 'move',
        position: randomPosition(),
        ...attackerCharacterConfig
      }
    )

    // Prioritize `idle` for stopping the monster if hit.
    this.prioritizedAnimationNames.add('idle')

    this.addAction([() => true, this.chasePlayer])

    /**
     * `Scene.timer` timeout task id for the `chasePlayer` task.
     *
     * Used for checking if enough time had passed since the last time `chasePlayer` is called.
     *
     * @private
     *
     * @type {number}
     */
    this.chasePlayerTimeoutTaskId = undefined

    /**
     * How many scores will the player gain if the monster is killed.
     *
     * @public
     */
    this.score = score

    /**
     * How many damage will the monster cause if it collides with the player.
     *
     * @public
     */
    this.collisionDamage = collisionDamage
  }

  /**
   * Whether the timeout task with `chasePlayerTimeoutTaskId` is done.
   *
   * @private
   */
  isReadyForNextChase() {
    if (this.chasePlayerTimeoutTaskId === undefined) {
      return true
    }

    return this.layer.scene.timer.isTaskDone(
      /* taskId */ this.chasePlayerTimeoutTaskId
    )
  }

  /**
   * Set direction `Up` or `Down` if only `Left` or `Right` is set and viceversa.
   *
   * @private
   */
  setRandomDirection() {
    const animationFrame = this.animation.getCurrentFrame()
    const hitbox = this.getBoundingBox()
    const hitboxActualPosition = hitbox.getActualPosition()

    const { config } = data

    /**
     * @type {import('../../engine').Direction[] | undefined}
     */
    let directionsPair

    if (!this.directions.get('Up') && !this.directions.get('Down')) {
      if (hitbox.position.y <= config.tileSize * 2) {
        directionsPair = ['Down']
      } else if (
        hitbox.position.y + animationFrame.sprite.height >=
        config.height - config.tileSize * 2 - 16
      ) {
        directionsPair = ['Up']
      } else {
        directionsPair = ['Up', 'Down']
      }
    } else if (!this.directions.get('Left') && !this.directions.get('Right')) {
      if (hitboxActualPosition.x <= config.tileSize * 2) {
        directionsPair = ['Right']
      } else if (
        hitboxActualPosition.x + hitbox.width >=
        config.width - config.tileSize * 2
      ) {
        directionsPair = ['Left']
      } else {
        directionsPair = ['Left', 'Right']
      }
    }

    if (directionsPair !== undefined) {
      this.directions.set(
        directionsPair[randomInt(0, directionsPair.length)],
        true
      )
    }
  }

  /**
   * Action to chase `GameLayer.player`.
   *
   * @private
   */
  chasePlayer() {
    if (!this.isReadyForNextChase()) {
      return
    }

    this.chasePlayerTimeoutTaskId = this.layer.scene.timer.setTimeout(
      /* delay */ randomInt(0, 90)
    )

    const playerHitbox = this.layer.player.getBoundingBox()
    const { x: playerX, y: playerY } = playerHitbox.getActualPosition()

    const hitbox = this.getBoundingBox()
    const { x, y } = hitbox.getActualPosition()

    for (const direction of this.directions.keys()) {
      this.directions.set(direction, false)
    }

    if (playerY + playerHitbox.height < y) {
      this.directions.set('Up', true)
    }

    if (playerX > x + hitbox.width) {
      this.directions.set('Right', true)
    }

    if (playerY > y + hitbox.height) {
      this.directions.set('Down', true)
    }

    if (playerX + playerHitbox.width < x) {
      this.directions.set('Left', true)
    }

    if (randomInt(0, 2) === 1) {
      this.setRandomDirection()
    }
  }

  /**
   * Turn willStop to `true`
   * and reduce `health` of the character by the passed damage value.
   *
   * Increase `GameScene.score` by `10` and call `destroy` if `health` is less than `0`.
   *
   * @override
   * @public
   *
   * @param {number} damage
   */
  takeDamage(damage) {
    super.takeDamage(damage)

    if (this.health <= 0) {
      this.layer.scene.score += this.score
      this.destroy()
    }
  }

  /**
   * Delete the monster from `GameLayer.monsters`.
   *
   * Clear actions and delete the reference to the current layer.
   *
   * @override
   * @public
   */
  destroy() {
    this.layer.monsters.delete(this)

    super.destroy()
  }
}

export class TinyZombie extends Monster {
  /**
   * @param {import('./layers').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* MonsterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.tinyZombie
        )
      }
    )
  }
}
