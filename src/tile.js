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
    this.spriteSheet = g.assets.image.dungeonTileSet

    this.sprite = new Sprite(sx, sy, sWidth, sHeight)
    this.position = vector(dx, dy)
  }
}

export class Floor extends Tile {
  /**
   * @param {number} dx
   * @param {number} dy
   */
  constructor(dx, dy) {
    super(/* sx */ 16, /* sy */ 64, TILE_SIZE, TILE_SIZE, dx, dy) // floor_1
  }
}
