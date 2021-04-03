export class Vector {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

/**
 * @param {number} x
 * @param {number} [y]
 */
export const vector = (x, y) => new Vector(x, y === undefined ? x : y)
