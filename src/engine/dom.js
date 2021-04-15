/**
 * Create offscreen canvas element for pre-rendering.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#pre-render_similar_primitives_or_repeating_objects_on_an_offscreen_canvas
 * |Pre-render similar primitives or repeating objects on an offscreen canvas}
 *
 * @param {HTMLImageElement} image
 * @param {number=} scale
 */
export const createOffscreenCanvas = (image, scale = 1) => {
  const actualWidth = image.width * scale
  const actualHeight = image.height * scale

  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = actualWidth
  offscreenCanvas.height = actualHeight

  const ctx = offscreenCanvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    image,
    /* dx */ 0,
    /* dy */ 0,
    /* dWidth */ actualWidth,
    /* dHeight */ actualHeight
  )

  return offscreenCanvas
}

/**
 * Create canvas element for `Layer` and return the 2D context.
 *
 * @param {number} width
 * @param {number} height
 * @param {number=} zIndex
 */
export const createLayerCanvasContext = (width, height, zIndex = 0) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.zIndex = zIndex.toString()
  return canvas.getContext('2d')
}

/**
 * Initialize `Scene` by appending the canvas elements of its layers to `#game`.
 *
 * @param {import('./scene').Scene} scene
 * @param {string} containerSelector
 */
export const initScene = (scene, containerSelector) => {
  const container =
    /**
     * @type {HTMLElement}
     */
    (document.querySelector(containerSelector))

  container.innerHTML = ''
  container.style.cssText = `width: ${scene.width}; height: ${scene.height}`

  for (const layer of scene.layers.values()) {
    container.appendChild(layer.ctx.canvas)
  }
}
