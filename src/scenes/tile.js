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
     * The sprite of the Tile.
     *
     * @private
     */
    this.sprite = new Sprite(spriteSheet, sx, sy, sWidth, sHeight)

    /**
     * The position of the tile on the canvas.
     *
     * @private
     */
    this.position = vector(dx, dy)
  }

  /**
   * Render the tile using the passed canvas 2D context.
   *
   * @public
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    this.sprite.render(ctx, /* dx */ this.position.x, /* dy */ this.position.y)
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
