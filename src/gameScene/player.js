import { AttackerCharacter } from '../character.js'
import { makeAnimationsMap } from '../animation.js'
import { data } from '../data.js'

export class Knight extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const animationsMap = makeAnimationsMap(data.animations.characters.knight)

    super({ animationsMap, layer })
  }
}
