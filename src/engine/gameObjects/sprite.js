import { vector } from '../math/vector.js'

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

  /**
   * Draw the sprite using the provided canvas context.
   *
   * @public
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} dx
   * @param {number} dy
   */
  render(ctx, dx, dy) {
    ctx.drawImage(
      this.spriteSheet,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      dx,
      dy,
      this.width,
      this.height
    )
  }

  /**
   * Draw the flipped sprite using the provided canvas context.
   *
   * {@link https://stackoverflow.com/a/37388113/13346012
   * |How to flip images horizontally with HTML5}
   *
   * @public
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} dx
   * @param {number} dy
   */
  renderFlipped(ctx, dx, dy) {
    ctx.save()
    ctx.translate(dx + this.width / 2, dy + this.height / 2)
    ctx.scale(-1, 1)
    this.render(ctx, -this.width / 2, -this.height / 2)
    ctx.restore()
  }
}
