const FPS = 60
const FPS_INTERVAL = 1000 / FPS

export class View {
  constructor() {
    /**
     * @private
     *
     * @type {number}
     */
    this.lastRenderTime = undefined
  }

  /**
   * @public
   *
   * @param {import('./game').Game} game
   */
  render(game) {
    window.requestAnimationFrame(() => this.render(game))

    const currentTime = performance.now()
    const elapsed = currentTime - this.lastRenderTime

    if (elapsed < FPS_INTERVAL) {
      return
    }

    this.lastRenderTime = currentTime - (elapsed || 0 % FPS_INTERVAL)
    game.render()
  }
}
