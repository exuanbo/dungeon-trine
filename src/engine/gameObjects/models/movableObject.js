import { ActableObject } from './actableObject.js'

/**
 * @typedef {import('./actableObject').ActableObjectConfig & {
 *    speed?: number
 * }} MovableObjectConfig
 */

/**
 * @typedef {'Up' | 'Right' | 'Down' | 'Left'} Direction
 */

export class MovableObject extends ActableObject {
  /**
   * @param {import('../../layer').Layer} layer
   * @param {MovableObjectConfig} movableObjectConfig
   */
  constructor(layer, { speed = 1, ...actableObjectConfig }) {
    super(layer, actableObjectConfig)

    this.addAction([this.willMove, this.move])

    /**
     * Four directions to move.
     *
     * @public
     *
     * @type {Map<Direction, boolean>}
     */
    this.directions = new Map([
      ['Up', false],
      ['Right', false],
      ['Down', false],
      ['Left', false]
    ])

    /**
     * How many pixels will the object move on each `update`. Default to `1`.
     *
     * @protected
     */
    this.speed = speed
  }

  /**
   * If the game object will move at next `update`.
   *
   * Decide by checking whether exists true value in `directions`.
   *
   * @private
   */
  willMove() {
    for (const isDirection of this.directions.values()) {
      if (isDirection) {
        return true
      }
    }

    return false
  }

  /**
   * Move action.
   *
   * Change `face` if turns direction from left to right or from right to left.
   *
   * @protected
   */
  move() {
    if (this.animationName !== 'move') {
      const isSet = this.setAnimation('move')
      if (!isSet) {
        return
      }
    }

    this.directions.forEach((isDirection, direction) => {
      if (isDirection) {
        switch (direction) {
          case 'Up':
            this.position.substract(0, this.speed)
            break
          case 'Right':
            this.position.add(this.speed, 0)
            if (!this.directions.get('Left')) {
              this.face = 'Right'
            }
            break
          case 'Down':
            this.position.add(0, this.speed)
            break
          case 'Left':
            this.position.substract(this.speed, 0)
            if (!this.directions.get('Right')) {
              this.face = 'Left'
            }
        }
      }
    })
  }
}
