import { AttackerCharacter } from './character.js'
import { randomInt } from '../../engine/index.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

/**
 * Generate an array of `Monster`.
 *
 * @param {import('./gameLayer').GameLayer} layer
 * @param {{ minAmount?: number, maxAmount: number }} options
 */
export const randomMonsters = (layer, { minAmount = 1, maxAmount }) =>
  Array(randomInt(/* min */ minAmount, /* max */ maxAmount + 1))
    .fill(undefined)
    .map(_ => new [TinyZombie][randomInt(/* min */ 0, /* max */ 1)](layer))

class Monster extends AttackerCharacter {
  /**
   * Turn willStop to `true`
   * and reduce `health` of the character by the passed damage value.
   *
   * Call `destroy` and remove itself from `GameLayer.monsters` if `health` is less than `0`.
   *
   * @override
   * @public
   *
   * @param {number} damage
   */
  takeDamage(damage) {
    super.takeDamage(damage, /* cb */ () => this.destroy())
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
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.tinyZombie
        ),
        defaultAnimationName: 'move',
        position: randomPosition(
          /* horizontalOffset */ 64,
          /* verticalOffset */ 64
        )
      }
    )
  }
}
