import { Layer } from '../layer.js'
import { Player } from './player.js'

export class GameLayer extends Layer {
  constructor() {
    super(/* zIndex */ 1)

    /**
     * User controlled character.
     *
     * @public
     */
    this.player = new Player()
  }

  /**
   * The implemented `Layer.render` method.
   *
   * Render charactors, effects and items in the layer.
   *
   * @override
   * @public
   */
  render() {
    this.player.render(this.ctx)
  }
}
