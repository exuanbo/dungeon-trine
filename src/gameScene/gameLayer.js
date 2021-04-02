import { Layer } from '../layer.js'
import { Player } from '../charactor.js'

export class GameLayer extends Layer {
  constructor() {
    super(/* zIndex */ 1)
    this.player = new Player(this.ctx)
  }

  render() {
    this.player.render()
  }
}
