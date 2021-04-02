import { View } from './view.js'

export class Layer {
  /**
   * @param {number} [zIndex]
   * @param {number} [width]
   * @param {number} [height]
   */
  constructor(zIndex, width, height) {
    this.ctx = View.createLayerCanvasContext(zIndex, width, height)
  }

  render() {
    throw new Error('Not implemented.')
  }
}
