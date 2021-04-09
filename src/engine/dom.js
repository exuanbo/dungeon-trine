/**
 * Create offscreen canvas for pre-rendering.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#pre-render_similar_primitives_or_repeating_objects_on_an_offscreen_canvas
 * |Pre-render similar primitives or repeating objects on an offscreen canvas}
 *
 * @param {HTMLImageElement} image
 */
export const createOffscreenCanvas = image => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = image.width
  offscreenCanvas.height = image.height
  offscreenCanvas.getContext('2d').drawImage(image, 0, 0)
  return offscreenCanvas
}

/**
 * Create canvas for `Layer` and return 2D context.
 *
 * @param {number} width
 * @param {number} height
 * @param {number=} zIndex
 */
export const createLayerCanvasContext = (width, height, zIndex = 0) => {
  const canvas = document.createElement('canvas')
  canvas.style.zIndex = zIndex.toString()
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
export const initScene = scene => {
  const gameContainer = document.getElementById('game')

  gameContainer.innerHTML = ''
  gameContainer.style.cssText = `width: ${scene.width}; height: ${scene.height}`

  for (const layer of scene.layers.values()) {
    gameContainer.appendChild(layer.ctx.canvas)
  }
}
