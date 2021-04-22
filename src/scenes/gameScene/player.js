import { AttackerCharacter } from './character.js'
import { Effect } from './effect.js'
import { createEmptyAnimation } from '../../engine/index.js'
import { createAnimationsMap, randomPosition } from '../utils.js'
import { data } from '../../data.js'

/**
 * @typedef {import('./character').AttackerCharacterConfig} PlayerConfig
 */

export class Player extends AttackerCharacter {
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
   * @param {('Left' | 'Right')=} sourceDirection
   */
  takeDamage(damage, sourceDirection) {
    const vectorMethodName = sourceDirection === 'Left' ? 'add' : 'substract'

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
          /* horizontalOffset */ 192,
          /* verticalOffset */ 112
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
            : this.position.clone().add(/* x */ 60, /* y */ 0)

        this.layer.effects.add(
          new Effect(this.layer, {
            animation: createEmptyAnimation(/* width */ 132, /* height */ 112),
            position: effectPosition,
            sender: this,
            damage: 2,
            once: false,
            duration: 1
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
          /* horizontalOffset */ 128,
          /* verticalOffset */ 128
        ),
        attackInterval: 120
      }
    )
  }
}
