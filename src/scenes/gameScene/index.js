import { Scene } from '../../engine/index.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'
import { data } from '../../data.js'

export class GameScene extends Scene {
  constructor() {
    const { width, height } = data.config

    super(/* sceneName */ 'game', /* sceneConfig */ { width, height })

    this.addLayer('background', new BackgroundLayer(/* scene */ this))
    this.addLayer('game', new GameLayer(/* scene */ this))
  }
}
