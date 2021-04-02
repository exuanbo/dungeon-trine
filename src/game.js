import { GameScene } from './gameScene/index.js'

export class Game {
  constructor() {
    this.scene = new GameScene()
  }

  render() {
    this.scene.render()
  }
}
