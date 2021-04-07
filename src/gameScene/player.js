import { AttackerCharacter } from '../character.js'
import { makeAnimationsMap } from '../animation.js'
import { data } from '../data.js'

/**
 * User controlled character.
 */
export class Player extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const animationsMap = makeAnimationsMap(data.animations.characters.knight)

    super({ animationsMap, layer })
  }
}
