import { View } from './view.js'

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#use_multiple_layered_canvases_for_complex_scenes
 * |Use multiple layered canvases for complex scenes}
 */
export class Layer {
  /**
   * @param {number=} zIndex
   * @param {number=} width
   * @param {number=} height
   */
  constructor(zIndex, width, height) {
    /**
     * If the layer has changed state.
     *
     * @protected
     *
     * @default true
     */
    this.isDirty = true

    /**
     * The canvas context for this layer.
     *
     * Generated by `View.makeLayerCanvasContext`
     *
     * @protected
     */
    this.ctx = View.makeLayerCanvasContext(zIndex, width, height)
  }

  /**
   * The abstract render method.
   *
   * @abstract
   * @public
   */
  render() {
    throw new Error('Not implemented.')
  }
}
