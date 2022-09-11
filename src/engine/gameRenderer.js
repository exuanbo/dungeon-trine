export class GameRenderer {
  /**
   * @param {number=} timeStep
   */
  constructor(timeStep = 1000 / 120) {
    /**
     * Used in `stop` for cancelling `window.requestAnimationFrame`.
     *
     * @private
     *
     * @type {number}
     */
    this.animationFrameRequestId = undefined

    /**
     * The last time `Game.update` is called.
     *
     * @private
     *
     * @type {number}
     */
    this.lastUpdateTime = undefined

    /**
     * Milliseconds between two updates.
     *
     * @private
     */
    this.timeStep = timeStep
  }

  /**
   * Render the game at the speed of `fps` frames per second.
   *
   * @public
   *
   * @param {import('./game').Game} game
   */
  render(game) {
    this.animationFrameRequestId = window.requestAnimationFrame(() =>
      this.render(game)
    )

    const now = performance.now()
    let delta = now - this.lastUpdateTime || this.timeStep

    if (delta < this.timeStep) {
      return
    }

    while (delta >= this.timeStep) {
      game.update()
      delta -= this.timeStep
    }

    this.lastUpdateTime = now - delta
    game.render()
  }

  /**
   * Stop the current render.
   * Throw an error if no `window.requestAnimationFrame` is called.
   *
   * @public
   */
  stop() {
    if (this.animationFrameRequestId === undefined) {
      throw new Error('There is no game being rendered.')
    }

    window.cancelAnimationFrame(this.animationFrameRequestId)
    this.animationFrameRequestId = undefined
  }
}
