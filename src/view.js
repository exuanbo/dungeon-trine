import { SPRITE } from './globals.js'

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

class View {
  constructor() {
    this.lastDrawTime = performance.now()
  }

  draw(game) {
    window.requestAnimationFrame(() => this.draw(game))
    const currentTime = performance.now()
    const elapsed = currentTime - this.lastDrawTime
    if (!SPRITE.complete || elapsed <= FPS_INTERVAL) {
      return
    }
    this.lastDrawTime = currentTime - (elapsed % FPS_INTERVAL)

    game.draw()
  }
}

export default View
