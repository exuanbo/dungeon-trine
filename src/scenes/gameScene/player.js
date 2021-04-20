import { AttackerCharacter } from './character.js'
import { Effect } from './effect.js'
import { createEmptyAnimation } from '../../engine/index.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

/**
 * @typedef {import('./character').AttackerCharacterConfig} PlayerConfig
 */

class Player extends AttackerCharacter {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   * @param {PlayerConfig} playerConfig
   */
  constructor(layer, playerConfig) {
    super(layer, /* attackerCharacterConfig */ playerConfig)

    /**
     * @override
     */
    this.isPlayer = true
  }

  /**
   * Move back the player with the distance of `getBoundingBox().width` pixels.
   *
   * Turn willStop to `true`
   * and reduce `health` of the character by the passed damage value.
   *
   * @override
   * @public
   *
   * @param {number} damage
   */
  takeDamage(damage) {
    const vectorMethodName = this.face === 'Left' ? 'add' : 'substract'

    this.position[vectorMethodName](
      /* x */ this.getBoundingBox().width,
      /* y */ 0
    )

    super.takeDamage(damage)
  }
}

export class Knight extends Player {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.knight
        ),
        position: randomPosition(
          /* horizontalOffset */ 96,
          /* verticalOffset */ 56
        ),
        speed: 2
      }
    )
  }

  /**
   * Add an effect with empty animation to `layer.effects`.
   *
   * @override
   * @protected
   */
  attack() {
    super.attack(
      /* cb */ () => {
        const effectPosition =
          this.face === 'Left'
            ? this.position
            : this.position.clone().add(/* x */ 30, /* y */ 0)

        this.layer.effects.add(
          new Effect(this.layer, {
            animation: createEmptyAnimation(/* width */ 66, /* height */ 56),
            position: effectPosition,
            sender: this,
            damage: 2,
            duration: 20
          })
        )
      }
    )
  }
}

export class Wizard extends Player {
  /**
   * @param {import('./gameLayer').GameLayer} layer
   */
  constructor(layer) {
    super(
      layer,
      /* attackerCharacterConfig */ {
        animationsMap: createAnimationsMap(
          /* animationDetailsMap */ data.animations.characters.wizard
        ),
        position: randomPosition(
          /* horizontalOffset */ 64,
          /* verticalOffset */ 64
        ),
        attackInterval: 120
      }
    )
  }
}
