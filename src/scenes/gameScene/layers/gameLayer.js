import { Layer } from '../../../engine/index.js'
import { Knight } from '../player.js'
import { randomMonsters } from '../monster.js'

/**
 * @extends {Layer<import('..').GameScene>}
 */
export class GameLayer extends Layer {
  /**
   * @param {import('..').GameScene} scene
   */
  constructor(scene) {
    super(scene, /* layerConfig */ { zIndex: 1 })

    /**
     * User controlled character. Default is `Knight`.
     *
     * @public
     */
    this.player = new Knight(/* layer */ this)

    /**
     * The monsters on the layer.
     *
     * @public
     */
    this.monsters = new Set(
      randomMonsters(/* layer */ this, /* options */ { maxAmount: 5 })
    )

    /**
     * Effects on the layer.
     *
     * @public
     *
     * @type {Set<import('../effect').Effect>}
     */
    this.effects = new Set()
  }

  /**
   * Handle the collision of the game objects.
   *
   * @private
   */
  handleCollision() {
    Array.from(this.effects).forEach(effect => {
      const hurtBox = effect.getBoundingBox()

      if (effect.sender.isPlayer) {
        Array.from(this.monsters).forEach(monster => {
          if (monster.getBoundingBox().isCollidingWith(hurtBox)) {
            effect.takeEffect(/* target */ monster)
          }
        })
      } else {
        const playerHitbox = this.player.getBoundingBox()

        if (playerHitbox.isCollidingWith(hurtBox)) {
          const effectSourceDirection =
            playerHitbox.getActualPosition().x < hurtBox.getActualPosition().x
              ? 'Right'
              : 'Left'

          effect.takeEffect(
            /* target */ this.player,
            /* sourceDirection */ effectSourceDirection
          )
        }
      }
    })

    this.monsters.forEach(monster => {
      if (
        monster.getBoundingBox().isCollidingWith(this.player.getBoundingBox())
      ) {
        this.player.takeDamage(
          /* damage */ 0.5,
          /* sourceDirection */ monster.face === 'Left' ? 'Right' : 'Left'
        )
      }
    })
  }

  /**
   * Update each game object.
   *
   * @override
   * @public
   */
  update() {
    this.effects.forEach(effect => {
      effect.update()
    })

    this.monsters.forEach(monster => {
      monster.update()
    })

    this.player.update()

    this.handleCollision()
  }

  /**
   * Render every game object to the layer canvas.
   *
   * @override
   * @public
   */
  render() {
    this.effects.forEach(effect => {
      effect.render()
    })

    this.monsters.forEach(monster => {
      monster.render()
    })

    this.player.render()
  }

  /**
   * Call `destroy` on each game object and delete the reference to the current scene.
   *
   * @override
   * @public
   */
  destroy() {
    this.player.destroy()
    this.player = null

    this.monsters.forEach(monster => {
      monster.destroy()
    })

    this.effects.forEach(effect => {
      effect.destroy()
    })

    super.destroy()
  }
}
