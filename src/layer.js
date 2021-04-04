import { View } from './view.js'

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#use_multiple_layered_canvases_for_complex_scenes
 * |Use multiple layered canvases for complex scenes}
 */
export class Layer {
  /**
   * @param {number} [zIndex]
   * @param {number} [width]
   * @param {number} [height]
   */
  constructor(zIndex, width, height) {
    this.ctx = View.makeLayerCanvasContext(zIndex, width, height)
  }

  render() {
    throw new Error('Not implemented.')
  }
}
