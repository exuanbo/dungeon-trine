import { Timer } from './timer.js'
import { appendLayersCanvas } from './dom.js'

class LayerNotExistError extends Error {
  /**
   * @param {string} layerName
   */
  constructor(layerName) {
    super(`Layer '${layerName}' already exists.`)
  }
}

/**
 * @typedef {{
 *    name: string
 *    width: number
 *    height: number
 * }} SceneConfig
 */

export class Scene {
  /**
   * @param {import('./game').Game} game
   * @param {SceneConfig} sceneConfig
   */
  constructor(game, { name, width, height }) {
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
     * If `init` has been called.
     *
     * @private
     */
    this.isInitialized = false

    /**
     * Reference to the `Game` instance. Set by `Game.addScene`.
     *
     * @public
     */
    this.game = game

    /**
     * The name of the scene.
     *
     * @public
     */
    this.name = name

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
      throw new LayerNotExistError(layerName)
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
      throw new LayerNotExistError(layerName)
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
   * Append the canvas elements of `layer` in `layers` to the container DOM element by `appendLayersCanvas`.
   *
   * Change `isInitialized` to `true`.
   *
   * @private
   */
  init() {
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

  /**
   * Render `layers`.
   *
   * @public
   */
  render() {
    if (!this.isInitialized) {
      this.init()
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
