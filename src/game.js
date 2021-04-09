import { GameScene } from './scenes/gameScene/index.js'

export class Game {
  constructor() {
    /**
     * Initial scene.
     *
     * @public
     */
    this.scene = new GameScene()
  }

  /**
   * Call `Scene.render`
   *
   * @public
   */
  render() {
    this.scene.render()
  }
}
