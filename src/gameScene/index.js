import { Scene } from '../scene.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'

export class GameScene extends Scene {
  constructor() {
    super('game', {
      background: new BackgroundLayer(),
      game: new GameLayer()
    })
  }
}
