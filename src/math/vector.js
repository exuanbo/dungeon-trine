/**
 * A simpler way to create `Vector`.
 *
 * @param {number=} x
 * @param {number=} y
 */
export const vector = (x = 0, y = undefined) =>
  new Vector(x, y === undefined ? x : y)

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
   * If both `x` and `y` are `0`.
   *
   * @public
   */
  isZero() {
    return this.x === 0 && this.y === 0
  }

  /**
   * Set the coordinates to the given values or copy from other Vector.
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

  /**
   * Add the passed value or vector and return a new `Vector`.
   *
   * @public
   *
   * @param {number|Vector} x
   * @param {number=} y
   */
  add(x, y) {
    if (x instanceof Vector) {
      if (x.isZero()) {
        return this
      }
      return new Vector(this.x + x.x, this.y + x.y)
    }

    if (y === undefined) {
      if (x === 0) {
        return this
      }
      y = x
    }

    return new Vector(this.x + x, this.y + y)
  }
}
