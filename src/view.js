const FPS = 60
const FPS_INTERVAL = 1000 / FPS

export class View {
  render(game) {
    window.requestAnimationFrame(() => this.render(game))

    const currentTime = performance.now()
    const elapsed = currentTime - this.lastDrawTime
    if (elapsed <= FPS_INTERVAL) {
      return
    }
    this.lastDrawTime = isNaN(elapsed)
      ? currentTime
      : currentTime - (elapsed % FPS_INTERVAL)

    game.render()
  }
}
