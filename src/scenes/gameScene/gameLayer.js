import { Layer } from '../../engine/layer.js'
import { Knight } from './player.js'

export class GameLayer extends Layer {
  /**
   * @param {import('../../engine/scene').Scene} scene
   */
  constructor(scene) {
    super(scene, /* zIndex */ 1)

    /**
     * User controlled character. Default is `Knight`.
     *
     * @public
     */
    this.player = new Knight(this)
  }

  /**
   * Update every game object.
   *
   * @override
   * @public
   */
  update() {
    this.player.update()
  }

  /**
   * Render every game object to the layer canvas.
   *
   * @override
   * @public
   */
  render() {
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
    super.destroy()
  }
}
