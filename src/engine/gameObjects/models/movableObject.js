import { ActableObject } from './actableObject.js'

/**
 * @typedef {'Up' | 'Right' | 'Down' | 'Left'} Direction
 */

export class MovableObject extends ActableObject {
  /**
   * @param {{
   *    animationsMap: import('../animation').AnimationsMap
   *    position: import('../../math/vector').Vector
   *    layer: import('../../layer').Layer
   * }} movableObjectMeta
   */
  constructor({ animationsMap, position, layer }) {
    super({ animationsMap, position, layer })

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
     * Default moving speed. Pixels per render.
     *
     * @protected
     */
    this.speed = 1
  }

  /**
   * If the game object will move at next render.
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
