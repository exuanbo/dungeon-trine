import { Scene } from '../engine/scene.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'
import { data } from '../data.js'

export class GameScene extends Scene {
  constructor() {
    super({
      sceneName: 'game',
      width: data.config.canvasSize,
      height: data.config.canvasSize
    })

    this.layers
      .set('background', new BackgroundLayer(this))
      .set('game', new GameLayer(this))
  }
}
