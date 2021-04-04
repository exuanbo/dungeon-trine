import { Sprite } from './sprite.js'
import { vector } from './vector.js'
import g, { TILE_SIZE } from './globals.js'

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
    const spriteSheet = g.assets.image.dungeonTileSet

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
    super(/* sx */ 16, /* sy */ 64, TILE_SIZE, TILE_SIZE, dx, dy) // floor_1
  }
}
