import { AttackerCharacter } from './character.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

export class Knight extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.knight
        ),
        position: randomPosition(
          /* horizontalOffset */ 96,
          /* verticalOffset */ 56
        ),
        speed: 2
      }
    )

    /**
     * @override
     */
    this.isPlayer = true
  }
}

export class Wizard extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.wizard
        ),
        position: randomPosition(
          /* horizontalOffset */ 64,
          /* verticalOffset */ 64
        ),
        speed: 1,
        attackInterval: 120
      }
    )

    /**
     * @override
     */
    this.isPlayer = true
  }
}
