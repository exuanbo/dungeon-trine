import { Layer } from '../../engine/index.js'
import { Knight } from './player.js'
import { randomMonsters } from './monster.js'

/**
 * @extends {Layer<import('.').GameScene>}
 */
export class GameLayer extends Layer {
  /**
   * @param {import('.').GameScene} scene
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
     * @private
     */
    this.monsters = new Set(
      randomMonsters(/* layer */ this, /* options */ { maxAmount: 5 })
    )
  }

  /**
   * Update each game object.
   *
   * @override
   * @public
   */
  update() {
    this.monsters.forEach(monster => {
      monster.update()
    })

    this.player.update()
  }

  /**
   * Render every game object to the layer canvas.
   *
   * @override
   * @public
   */
  render() {
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
    this.monsters.clear()

    super.destroy()
  }
}
