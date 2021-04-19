import { vector } from './vector.js'

export class Box {
  /**
   * @param {number} width
   * @param {number} height
   * @param {{
   *    position?: import('./vector').Vector
   *    offset?: import('./vector').Vector
   * }=} boxPosition
   */
  constructor(width, height, { position = vector(), offset = vector() } = {}) {
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
     * The position of the box, not counting `offset`.
     *
     * @public
     */
    this.position = position

    /**
     * The offset position of the box.
     *
     * @public
     */
    this.offset = offset

    /**
     * Functions that return actual position of the corresponding four vertices.
     *
     * @public
     *
     * @type {Map<'tl' | 'tr' | 'br' | 'bl', () => import('./vector').Vector>}
     */
    this.vertices = new Map([
      ['tl', () => this.getActualPosition()],
      ['tr', () => this.getActualPosition().add(width, 0)],
      ['br', () => this.getActualPosition().add(width, height)],
      ['bl', () => this.getActualPosition().add(0, height)]
    ])
  }

  /**
   * Get the actual position of the box according to `position` and `offset`.
   *
   * @public
   */
  getActualPosition() {
    return this.position.clone().add(this.offset)
  }

  /**
   * Test if the given point is inside the box or on the one of the edges of the box.
   *
   * @param {import('./vector').Vector} point
   *
   * @public
   */
  isPointInBox(point) {
    const actualPosition = this.getActualPosition()

    return (
      actualPosition.x <= point.x &&
      point.x <= actualPosition.x + this.width &&
      actualPosition.y <= point.y &&
      point.y <= actualPosition.y + this.height
    )
  }

  /**
   * Test if the two boxes collide.
   *
   * @param {Box} other
   *
   * @public
   */
  isCollidedWith(other) {
    for (const getOtherVertex of other.vertices.values()) {
      if (this.isPointInBox(getOtherVertex())) {
        return true
      }
    }

    for (const getVertex of this.vertices.values()) {
      if (other.isPointInBox(getVertex())) {
        return true
      }
    }

    return false
  }
}
