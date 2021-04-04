import { View } from './view.js'

export class Scene {
  /**
   * @param {Object<string, import('./layer').Layer>} layers
   */
  constructor(layers) {
    /**
     * If the layers has been appended to DOM by `View.initScene`
     *
     * @private
     */
    this.isInitialized = false

    /**
     * The layers of the scene.
     *
     * @public
     */
    this.layers = layers
  }

  /**
   * Render the layers.
   *
   * Call `View.initScene` if not initialized.
   *
   * @public
   */
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
