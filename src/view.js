import { data } from './data.js'

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

export class View {
  /**
   * Create offscreen canvas for pre-rendering.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#pre-render_similar_primitives_or_repeating_objects_on_an_offscreen_canvas
   * |Pre-render similar primitives or repeating objects on an offscreen canvas}
   *
   * @public
   * @static
   *
   * @param {HTMLImageElement} image
   */
  static makeOffscreenCanvas(image) {
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = image.width
    offscreenCanvas.height = image.height
    offscreenCanvas.getContext('2d').drawImage(image, 0, 0)
    return offscreenCanvas
  }

  /**
   * Create canvas for `Layer`.
   *
   * @public
   * @static
   */
  static makeLayerCanvasContext(
    zIndex = 0,
    width = data.config.canvasSize,
    height = data.config.canvasSize
  ) {
    const canvas = document.createElement('canvas')
    canvas.style.zIndex = zIndex
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#controlling_image_scaling_behavior
     * |Controlling image scaling behavior}
     */
    ctx.imageSmoothingEnabled = false
    return ctx
  }

  /**
   * Initialize `Scene` by appending the canvas elements of its layers to `#game`.
   *
   * @public
   * @static
   *
   * @param {import('./scene').Scene} scene
   */
  static initScene(scene) {
    const gameContainer = document.getElementById('game')

    gameContainer.innerHTML = ''
    gameContainer.style.height = gameContainer.style.width =
      data.config.canvasSize

    const { layers } = scene
    for (const layerName in layers) {
      gameContainer.appendChild(layers[layerName].ctx.canvas)
    }
  }

  constructor() {
    /**
     * @private
     *
     * @type {number}
     */
    this.lastRenderTime = undefined
  }

  /**
   * Render `Game`.
   *
   * @public
   *
   * @param {import('./game').Game} game
   */
  render(game) {
    window.requestAnimationFrame(() => this.render(game))

    const currentTime = performance.now()
    const elapsed = currentTime - this.lastRenderTime

    if (elapsed < FPS_INTERVAL) {
      return
    }

    this.lastRenderTime = currentTime - (elapsed || 0 % FPS_INTERVAL)
    game.render()
  }
}
