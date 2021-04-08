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
     * Functions that return coordinates of the corresponding four vertices `tl`, `tr`, `br`, `bl`.
     *
     * @public
     */
    this.vertices = new Map([
      ['tl', () => vector(this.position.x, this.position.y)],
      ['tr', () => vector(this.position.x + width, this.position.y)],
      ['br', () => vector(this.position.x + width, this.position.y + width)],
      ['bl', () => vector(this.position.x, this.position.y + width)]
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
    for (const getOtherVertex of otherBox.vertices.values()) {
      if (this.isPointInBox(getOtherVertex())) {
        return true
      }
    }

    for (const getVertex of this.vertices.values()) {
      if (otherBox.isPointInBox(getVertex())) {
        return true
      }
    }

    return false
  }
}
