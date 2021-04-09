import { View } from './view.js'
import { Timer } from './timer.js'

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
     * The timer instance for the scene.
     *
     * @public
     */
    this.timer = new Timer()

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
     * @type {Map<string, import('./layer').Layer>}
     */
    this.layers = new Map()
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

    this.timer.update()

    for (const layer of this.layers.values()) {
      layer.render()
    }
  }

  /**
   * Delete the reference to the layers.
   *
   * @public
   */
  destroy() {
    this.timer.clearAll()

    for (const layer of this.layers.values()) {
      layer.destroy()
    }
    this.layers.clear()
  }
}
