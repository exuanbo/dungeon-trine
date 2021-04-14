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
      /* spriteSheets */ data.assets.images,
      /* animationEntries */ data.animations.characters.knight
    )

    const { width, height, tileSize } = data.config

    const position = vector(
      /* x */ width / 2 - tileSize / 2,
      /* y */ height / 2 - tileSize / 2
    )

    super({ animationsMap, position, layer })

    /**
     * @override
     */
    this.speed = 2
  }
}
