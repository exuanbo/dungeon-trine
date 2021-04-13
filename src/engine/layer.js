import { createLayerCanvasContext } from './dom.js'

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#use_multiple_layered_canvases_for_complex_scenes
 * |Use multiple layered canvases for complex scenes}
 */
export class Layer {
  /**
   * @param {import('./scene').Scene} scene
   * @param {number=} zIndex
   */
  constructor(scene, zIndex) {
    /**
     * If the layer has changed state.
     *
     * @protected
     *
     * @default true
     */
    this.isDirty = true

    /**
     * Reference to the current scene.
     *
     * @public
     */
    this.scene = scene

    /**
     * The canvas context for this layer.
     *
     * Generated by `createLayerCanvasContext`.
     *
     * @public
     */
    this.ctx = createLayerCanvasContext(scene.width, scene.height, zIndex)
  }

  /**
   * Abstract method for updating the properties of the game objects.
   *
   * @abstract
   * @public
   */
  update() {
    throw new Error('Not implemented.')
  }

  /**
   * Abstract method for rendering the game objects to the layer canvas.
   *
   * @abstract
   * @public
   */
  render() {
    throw new Error('Not implemented.')
  }

  /**
   * Delete the reference to the current scene.
   *
   * @public
   */
  destroy() {
    this.scene = null
    this.ctx = null
  }
}
