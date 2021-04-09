export class BaseObject {
  /**
   * @param {{
   *    animation: import('../animation').Animation
   *    position: import('../../math/vector').Vector
   *    layer: import('../../layer').Layer
   * }} baseObjectMeta
   */
  constructor({ animation, position, layer }) {
    /**
     * Which side is the game object facing. Sprite would be flipped if facing left.
     *
     * @protected
     */
    this.face = 'Right'

    /**
     * The animation of the game object.
     *
     * @protected
     */
    this.animation = animation

    /**
     * The position of the game object on the current layer.
     *
     * @protected
     */
    this.position = position

    /**
     * Reference to the current layer.
     *
     * @protected
     */
    this.layer = layer
  }

  /**
   * Clear the current animation frame sprite from the current layer.
   *
   * @protected
   */
  clearSprite() {
    const currentAnimationFrame = this.animation.getCurrentFrame()

    this.layer.ctx.clearRect(
      this.position.x,
      this.position.y,
      currentAnimationFrame.sprite.width,
      currentAnimationFrame.sprite.height
    )
  }

  /**
   * Render the next animation frame sprite to the current layer.
   *
   * @protected
   */
  renderSprite() {
    const nextAnimationFrame = this.animation.getNextFrame()

    if (this.face === 'Left') {
      nextAnimationFrame.sprite.renderFlipped(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    } else {
      nextAnimationFrame.sprite.render(
        this.layer.ctx,
        this.position.x,
        this.position.y
      )
    }
  }

  /**
   * Render the game object to the current layer.
   *
   * @public
   */
  render() {
    this.clearSprite()
    this.renderSprite()
  }

  /**
   * Delete the reference to the current layer.
   *
   * @public
   */
  destroy() {
    this.layer = null
  }
}
