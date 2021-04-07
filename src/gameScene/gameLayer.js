import { Layer } from '../layer.js'
import { Knight } from './player.js'

export class GameLayer extends Layer {
  constructor() {
    super(/* zIndex */ 1)

    /**
     * User controlled character. Default is `Knight`.
     *
     * @public
     */
    this.player = new Knight(this)
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
    this.player.render()
  }
}
