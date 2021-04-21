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
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndex};
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  `
  return canvas.getContext('2d')
}

/**
 * Appending the canvas elements of the layers to `containerSelector`.
 *
 * @param {Map<string, import('./layer').Layer>} layers
 * @param {{
 *    containerSelector: string
 *    width: number
 *    height: number
 * }} target
 */
export const appendLayersCanvas = (
  layers,
  { containerSelector, width, height }
) => {
  const container =
    /**
     * @type {HTMLElement}
     */
    (document.querySelector(containerSelector))

  container.innerHTML = ''
  container.style.cssText = `
    width: ${width}px;
    max-width: 100%;
    height: ${height}px;
    max-height: 100%;
    `

  for (const layer of layers.values()) {
    container.appendChild(layer.ctx.canvas)
  }
}
