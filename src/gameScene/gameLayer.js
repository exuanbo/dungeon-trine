import { Layer } from '../layer.js'
import { Player } from '../charactor.js'

export class GameLayer extends Layer {
  constructor() {
    super(/* zIndex */ 1)

    /**
     * User controlled charactor.
     *
     * @public
     */
    this.player = new Player(this.ctx)
  }

  /**
   * The implemented `Layer.render` method.
   *
   * Render charactors, effects and items in the layer.
   *
   * @public
   */
  render() {
    this.player.render()
  }
}
