import { AttackerCharacter } from './character.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

export class Knight extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const animationsMap = createAnimationsMap(
      /* spriteSheets */ data.assets.images,
      /* animationEntries */ data.animations.characters.knight
    )

    const position = randomPosition(/* offsetX */ 96, /* offsetY */ 56)

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
