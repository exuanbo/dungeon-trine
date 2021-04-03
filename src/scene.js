import { View } from './view.js'

export class Scene {
  /**
   * @param {Object<string, import('./layer').Layer>} layers
   */
  constructor(layers) {
    this.isInitialized = false
    this.layers = layers
  }

  render() {
    if (!this.isInitialized) {
      View.initScene(this)
      this.isInitialized = true
    }

    for (const layerName in this.layers) {
      this.layers[layerName].render()
    }
  }
}
