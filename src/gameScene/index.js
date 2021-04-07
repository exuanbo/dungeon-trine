import { Scene } from '../scene.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'

export class GameScene extends Scene {
  constructor() {
    super('game')

    this.layers.background = new BackgroundLayer(this)
    this.layers.game = new GameLayer(this)
  }
}
