import { AttackerCharacter } from './character.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

export class Player extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {import('./character').AttackerCharacterConfig} attackerCharacterConfig
   */
  constructor(layer, attackerCharacterConfig) {
    super(layer, attackerCharacterConfig)

    /**
     * @public
     */
    this.isPlayer = true
  }
}

export class Knight extends Player {
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
  }
}
