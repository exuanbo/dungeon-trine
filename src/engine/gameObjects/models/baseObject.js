/**
 * @typedef {{
 *    animation: import('../animation').Animation
 *    position: import('../../math/vector').Vector
 * }} BaseObjectConfig
 */

/**
 * @template {import('../../layer').Layer} L
 */
export class BaseObject {
  /**
   * @param {L} layer
   * @param {BaseObjectConfig} baseObjectConfig
   */
  constructor(layer, { animation, position }) {
    /**
     * If `renderSprite` has been called.
     *
     * Changed back to `false` by `clearSprite`.
     *
     * @protected
     */
    this.isRendered = false

    /**
     * Which side is the game object facing. Sprite will be flipped if the value is `Left`.
     *
     * @protected
     */
    this.face = 'Right'

    /**
     * Reference to the layer.
     *
     * @protected
     */
    this.layer = layer

    /**
     * The animation of the game object.
     *
     * @protected
     */
    this.animation = animation

    /**
     * The position of the game object on the layer.
     *
     * @protected
     */
    this.position = position
  }

  /**
   * Clear the current animation frame sprite from the layer.
   *
   * Change `isRendered` back to `false`.
   *
   * @protected
   */
  clearSprite() {
    this.animation
      .getCurrentFrame()
      .sprite.clear(this.layer.ctx, this.position.x, this.position.y)

    this.isRendered = false
  }

  /**
   * Render the current animation frame sprite to the layer.
   *
   * Change `isRendered` to `true`.
   *
   * @protected
   */
  renderSprite() {
    const spriteRenderMethod = this.face === 'Left' ? 'renderFlipped' : 'render'

    this.animation
      .getCurrentFrame()
      .sprite[spriteRenderMethod](
        this.layer.ctx,
        this.position.x,
        this.position.y
      )

    this.isRendered = true
  }

  /**
   * Abstract method for updating the properties of the game object.
   *
   * @abstract
   * @public
   */
  update() {
    throw new Error('Not implemented.')
  }

  /**
   * Abstract method for rendering the game object to the layer canvas.
   *
   * @abstract
   * @public
   */
  render() {
    throw new Error('Not implemented.')
  }

  /**
   * Delete the reference to the layer.
   *
   * @public
   */
  destroy() {
    this.layer = null
  }
}
