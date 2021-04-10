export class GameRenderer {
  /**
   * @param {number} fps
   */
  constructor(fps) {
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
    this.lastRenderTimer = undefined

    /**
     * Frames per second.
     *
     * @private
     */
    this.fps = fps
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

    const currentTime = performance.now()
    const elapsed = currentTime - this.lastRenderTime

    if (elapsed < this.fps) {
      return
    }

    this.lastRenderTime = currentTime - ((elapsed || 0) % this.fps)
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
