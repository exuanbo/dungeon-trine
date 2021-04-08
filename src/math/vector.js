export class Vector {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /**
     * The x coordinate of the vector.
     *
     * @public
     */
    this.x = x

    /**
     * The y coordinate of the vector
     *
     * @public
     */
    this.y = y
  }

  /**
   * Set the coordinate to the given value.
   *
   * @public
   *
   * @param {number|Vector} x
   * @param {number=} y
   */
  set(x, y) {
    if (x instanceof Vector) {
      this.x = x.x
      this.y = x.y
    } else {
      this.x = x
      this.y = y === undefined ? x : y
    }

    return this
  }
}

/**
 * A simpler way to create `Vector`
 *
 * @param {number} x
 * @param {number=} y
 */
export const vector = (x, y) => new Vector(x, y === undefined ? x : y)
