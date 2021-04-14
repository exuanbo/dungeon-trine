import { AttackerCharacter } from './character.js'
import { createAnimationsMap } from '../utils.js'
import { vector } from '../../engine/math/vector.js'
import { data } from '../../data.js'

export class Knight extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    const animationsMap = createAnimationsMap(
      data.assets.images,
      data.animations.characters.knight
    )
    const position = vector(
      data.config.canvasSize / 2 - data.config.tileSize / 2
    )

    super({ animationsMap, position, layer })
  }
}
