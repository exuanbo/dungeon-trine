import { Timer } from './timer.js'
import { appendLayersCanvas } from './dom.js'

export class Scene {
  /**
   * @param {{
   *    sceneName: string
   *    width: number
   *    height: number
   * }} sceneConfig
   */
  constructor({ sceneName, width, height }) {
    /**
     * Reference to the `Game` instance. Set by `Game.addScene`.
     *
     * @public
     *
     * @type {import('./game').Game}
     */
    this.game = undefined

    /**
     * The timer instance for the scene.
     *
     * @public
     */
    this.timer = new Timer()

    /**
     * The layers of the scene.
     *
     * @private
     *
     * @type {Map<string, import('./layer').Layer>}
     */
    this.layers = new Map()

    /**
     * If the canvas elements of `layer` in `layers` have been appended to container DOM element by `appendLayersCanvas`.
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
   * Add a layer to the scene.
   * Throw an error if layer name already exists.
   *
   * @public
   *
   * @param {string} layerName
   * @param {import('./layer').Layer} layer
   */
  addLayer(layerName, layer) {
    if (this.layers.has(layerName)) {
      throw new Error(`Layer '${layerName}' already exists.`)
    }

    this.layers.set(layerName, layer)
  }

  /**
   * Get the layer with the passed layer name.
   * Throw an error if passed layer name does not exist.
   *
   * @public
   *
   * @param {string} layerName
   */
  getLayer(layerName) {
    if (!this.layers.has(layerName)) {
      throw new Error(`Layer '${layerName}' does not exist.`)
    }

    return this.layers.get(layerName)
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
      appendLayersCanvas(
        /* layers */ this.layers,
        /* target */ {
          containerSelector: this.game.containerSelector,
          width: this.width,
          height: this.height
        }
      )
      this.isInitialized = true
    }

    for (const layer of this.layers.values()) {
      layer.render()
    }
  }

  /**
   * Clear `timer` and delete the references to `layers` and `game`.
   *
   * @public
   */
  destroy() {
    this.timer.clearAll()

    for (const layer of this.layers.values()) {
      layer.destroy()
    }
    this.layers.clear()

    this.game = null
  }
}
