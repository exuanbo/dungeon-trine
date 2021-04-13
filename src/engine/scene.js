import { Timer } from './timer.js'
import { initScene } from './dom.js'

export class Scene {
  /**
   * @param {{
   *    sceneName: string
   *    width: number
   *    height: number
   * }} sceneMeta
   */
  constructor({ sceneName, width, height }) {
    /**
     * If `layers` canvas element has been appended to DOM by `initScene`.
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
     * The layers of the scene.
     *
     * @public
     *
     * @type {Map<string, import('./layer').Layer>}
     */
    this.layers = new Map()

    /**
     * The name of the scene.
     *
     * @public
     */
    this.name = sceneName

    /**
     * The width of the scene.
     *
     * @public
     */
    this.width = width

    /**
     * The height of the scene.
     *
     * @public
     */
    this.height = height
  }

  /**
   * Update `timer` and `layers`.
   *
   * @public
   */
  update() {
    this.timer.update()

    for (const layer of this.layers.values()) {
      layer.update()
    }
  }

  /**
   * Render `layers`.
   *
   * @public
   */
  render() {
    if (!this.isInitialized) {
      initScene(this)
      this.isInitialized = true
    }

    for (const layer of this.layers.values()) {
      layer.render()
    }
  }

  /**
   * Clear `timer` and delete the reference to the `layers`.
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
