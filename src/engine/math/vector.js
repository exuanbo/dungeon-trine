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
   * Create a new `Vector` with the same `x` and `y`.
   *
   * @public
   */
  clone() {
    return new Vector(this.x, this.y)
  }

  /**
   * Set `x` and `y` to the passed values.
   *
   * @public
   *
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    this.x = x
    this.y = y
    return this
  }

  /**
   * Copy `x` and `y` of the passed vector to itself.
   *
   * @public
   *
   * @param {Vector} other
   */
  copy(other) {
    return this.set(other.x, other.y)
  }

  /**
   * Add the passed values or vector to itself.
   *
   * @public
   *
   * @param {number | Vector} x
   * @param {number=} y
   */
  add(x, y) {
    if (typeof x !== 'number') {
      if (x.isZero()) {
        return this
      }
      return this.set(this.x + x.x, this.y + x.y)
    }

    if (y === undefined) {
      if (x === 0) {
        return this
      }
      y = x
    }
    return this.set(this.x + x, this.y + y)
  }

  /**
   * Substract the passed values or vector from itself.
   *
   * @public
   *
   * @param {number | Vector} x
   * @param {number=} y
   */
  substract(x, y) {
    if (typeof x !== 'number') {
      if (x.isZero()) {
        return this
      }
      return this.set(this.x - x.x, this.y - x.y)
    }

    if (y === undefined) {
      if (x === 0) {
        return this
      }
      y = x
    }
    return this.set(this.x - x, this.y - y)
  }
}
