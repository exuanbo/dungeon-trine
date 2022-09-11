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

    const self = this
    /**
     * Functions that return actual position of the corresponding four vertices.
     *
     * @public
     *
     * @type {Record<'tl' | 'tr' | 'br' | 'bl', import('./vector').Vector>}
     */
    this.vertices = {
      get tl() {
        return self.getActualPosition()
      },
      get tr() {
        return self.getActualPosition().add(width, 0)
      },
      get br() {
        return self.getActualPosition().add(width, height)
      },
      get bl() {
        return self.getActualPosition().add(0, height)
      }
    }
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
    for (const otherVertex of Object.values(other.vertices)) {
      if (this.isPointInBox(otherVertex)) {
        return true
      }
    }

    for (const vertex of Object.values(this.vertices)) {
      if (other.isPointInBox(vertex)) {
        return true
      }
    }

    return false
  }
}
