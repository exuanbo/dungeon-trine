import { Sprite, vector } from '../engine/index.js'
import { data } from '../data.js'

export class Tile {
  /**
   * @param {number} sx
   * @param {number} sy
   * @param {number} sWidth
   * @param {number} sHeight
   * @param {number} dx
   * @param {number} dy
   */
  constructor(sx, sy, sWidth, sHeight, dx, dy) {
    const spriteSheet = data.assets.images['0x72_DungeonTilesetII_v1.3']

    /**
     * @public
     */
    this.sprite = new Sprite(spriteSheet, sx, sy, sWidth, sHeight)

    /**
     * @public
     */
    this.position = vector(dx, dy)
  }
}

/**
 * Tile with given sprite.
 */
export class Floor extends Tile {
  /**
   * @param {number} dx
   * @param {number} dy
   */
  constructor(dx, dy) {
    const { tileSize } = data.config

    super(
      /* sx */ 64,
      /* sy */ 256,
      /* sWidth */ tileSize,
      /* sHeight */ tileSize,
      dx,
      dy
    )
  }
}
