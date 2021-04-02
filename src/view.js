import { CANVAS_SIZE } from './globals.js'

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

export class View {
  static createLayerCanvasContext(
    zIndex = 0,
    width = CANVAS_SIZE,
    height = CANVAS_SIZE
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
   * @param {import('./scene').Scene} scene
   */
  static initScene(scene) {
    const gameContainer = document.getElementById('game')

    gameContainer.innerHTML = ''
    gameContainer.style.height = gameContainer.style.width = CANVAS_SIZE

    Object.values(scene.layers).forEach(layer => {
      gameContainer.appendChild(layer.ctx.canvas)
    })
  }

  /**
   * @param {import('./game').Game} game
   */
  render(game) {
    window.requestAnimationFrame(() => this.render(game))

    const currentTime = performance.now()
    const elapsed = currentTime - this.lastDrawTime
    if (elapsed <= FPS_INTERVAL) {
      return
    }
    this.lastDrawTime = isNaN(elapsed)
      ? currentTime
      : currentTime - (elapsed % FPS_INTERVAL)

    game.render()
  }
}
