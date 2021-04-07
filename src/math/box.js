import { vector } from './vector.js'

export class Box {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x, y, width, height) {
    /**
     * The position of the box. Represented as the top-left vertex coordinate.
     *
     * @public
     */
    this.position = vector(x, y)

    /**
     * The width of the box.
     *
     * @public
     */
    this.width = width

    /**
     * The height of the box.
     *
     * @public
     */
    this.height = height

    /**
     * The coordinates of the four vertices `tl`, `tr`, `br`, `bl`.
     *
     * @public
     */
    this.vertices = new Map([
      ['tl', vector(x, y)],
      ['tr', vector(x + width, y)],
      ['br', vector(x + width, y + width)],
      ['bl', vector(x, y + width)]
    ])
  }

  /**
   * Test if the given point is inside the box or on the one of the edges of the box.
   *
   * @param {import('./vector').Vector} point
   *
   * @public
   */
  isPointInBox(point) {
    return (
      this.position.x <= point.x <= this.position.x + this.width &&
      this.position.y <= point.y <= this.position.y + this.height
    )
  }

  /**
   * Test if the two boxes collide.
   *
   * @param {Box} otherBox
   *
   * @public
   */
  isCollidedWith(otherBox) {
    for (const otherVertex of otherBox.vertices.values()) {
      if (this.isPointInBox(otherVertex)) {
        return true
      }
    }

    for (const vertex of this.vertices.values()) {
      if (otherBox.isPointInBox(vertex)) {
        return true
      }
    }

    return false
  }
}
