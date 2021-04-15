export class GameRenderer {
  /**
   * @param {number=} timeStep
   */
  constructor(timeStep = 10) {
    /**
     * Used in `stop` for cancelling `window.requestAnimationFrame`.
     *
     * @private
     *
     * @type {number}
     */
    this.animationFrameRequestId = undefined

    /**
     * The last time `game` is rendered.
     *
     * @private
     *
     * @type {number}
     */
    this.lastRenderTime = undefined

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

    let delta = performance.now() - this.lastRenderTime

    if (delta < this.timeStep) {
      return
    }

    while (delta > 0) {
      game.update()
      delta -= this.timeStep
    }

    this.lastRenderTime = performance.now()
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
