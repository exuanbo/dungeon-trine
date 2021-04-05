import { vector } from './vector.js'

export class Sprite {
  /**
   * @param {HTMLImageElement|HTMLCanvasElement} spriteSheet
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(spriteSheet, x, y, width, height) {
    /**
     * Sprite sheet for this sprite.
     *
     * @public
     */
    this.spriteSheet = spriteSheet

    /**
     * Image position on the sprite sheet.
     *
     * @public
     */
    this.position = vector(x, y)

    /**
     * Sprite width.
     *
     * @public
     */
    this.width = width

    /**
     * Sprite height.
     *
     * @public
     */
    this.height = height
  }
}
