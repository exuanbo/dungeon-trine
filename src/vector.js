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
}

/**
 * A simpler way to create `Vector`
 *
 * @param {number} x
 * @param {number=} y
 */
export const vector = (x, y) => new Vector(x, y === undefined ? x : y)
