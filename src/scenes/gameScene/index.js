import { Scene } from '../../engine/scene.js'
import { BackgroundLayer } from './backgroundLayer.js'
import { GameLayer } from './gameLayer.js'
import { data } from '../../data.js'

export class GameScene extends Scene {
  constructor() {
    const { width, height } = data.config

    super(/* sceneConfig */ { sceneName: 'game', width, height })

    this.layers
      .set('background', new BackgroundLayer(/* scene */ this))
      .set('game', new GameLayer(/* scene */ this))
  }
}
