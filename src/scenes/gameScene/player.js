import { AttackerCharacter } from './character.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

export class Knight extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const animationsMap = createAnimationsMap(
      /* animationDetailsMap */ data.animations.characters.knight
    )

    const position = randomPosition(
      /* horizontalOffset */ 96,
      /* verticalOffset */ 56
    )

    super(
      layer,
      /* attackerCharacterConfig */ { animationsMap, position, speed: 2 }
    )

    /**
     * @override
     */
    this.isPlayer = true
  }
}
