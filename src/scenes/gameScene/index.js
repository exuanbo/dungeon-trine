import { Scene } from '../../engine/index.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'
import { HUDLayer } from './hudLayer.js'
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
  }
}
