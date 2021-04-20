import { vector } from './vector.js'

export class BoundingBox {
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
     * The width of the bounding box.
     *
     * @public
     */
    this.width = width

    /**
     * The height of the bounding box.
     *
     * @public
     */
    this.height = height

    /**
     * The position of the bounding box, not counting `offset`.
     *
     * @public
     */
    this.position = position

    /**
     * The offset position of the bounding box.
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
   * Check if the given point is inside the bounding box or on the edge.
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
   * Check whether the two bounding boxes collide.
   *
   * @param {BoundingBox} other
   *
   * @public
   */
  isCollidingWith(other) {
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
