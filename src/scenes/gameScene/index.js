import { Scene } from '../../engine/index.js'
import { BackgroundLayer, GameLayer, HUDLayer } from './layers/index.js'

import { data } from '../../data.js'

export class GameScene extends Scene {
  /**
   * @param {import('../../game').Game} game
   */
  constructor(game) {
    const { width, height } = data.config

    super(game, /* sceneConfig */ { name: 'game', width, height })

    this.addLayer('background', new BackgroundLayer(/* scene */ this))
    this.addLayer('game', new GameLayer(/* scene */ this))
    this.addLayer('hud', new HUDLayer(/* scene */ this))

    /**
     * The current score of the game.
     *
     * @public
     */
    this.score = 0
  }
}
