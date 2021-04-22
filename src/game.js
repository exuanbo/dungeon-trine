import { Game as BaseGame } from './engine/index.js'
import { GameScene } from './scenes/index.js'

export class Game extends BaseGame {
  constructor() {
    super()

    this.addScene(new GameScene(/* game */ this))
  }
}
