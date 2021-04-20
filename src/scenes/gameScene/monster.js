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

export class TinyZombie extends AttackerCharacter {
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
        ),
        speed: 1
      }
    )
  }
}
