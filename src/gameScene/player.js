import { AttackerCharacter } from '../character.js'
import { makeAnimationsMap } from '../animation.js'
import g from '../globals.js'

/**
 * User controlled character.
 */
export class Player extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const spriteSheet = g.assets.image.knight
    const animationsMap = makeAnimationsMap(spriteSheet, [
      ['idle', 0, 0, 48, 28, 4],
      ['move', 0, 28, 48, 28, 4],
      ['attack', 0, 56, 48, 28, 2]
    ])

    super({ animationsMap, layer })
  }
}
