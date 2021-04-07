import { View } from './view.js'

export class Scene {
  /**
   * @param {string} sceneName
   */
  constructor(sceneName) {
    /**
     * If the layers has been appended to DOM by `View.initScene`
     *
     * @private
     */
    this.isInitialized = false

    /**
     * The name of the scene.
     *
     * @public
     */
    this.name = sceneName

    /**
     * The layers of the scene.
     *
     * @public
     *
     * @type {Object<string, import('./layer').Layer>}
     */
    this.layers = {}
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
