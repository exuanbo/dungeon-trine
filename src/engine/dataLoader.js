import { createOffscreenCanvas } from './dom.js'

export class DataLoader {
  /**
   * @public
   * @static
   *
   * @param {string} url
   */
  static async fetchJson(url) {
    const response = await fetch(url)
    return await response.json()
  }

  /**
   * @public
   * @static
   *
   * @param {string} url
   */
  static async fetchBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  /**
   * @public
   * @static
   *
   * @param {string} url
   */
  static getFileNameFrom(url) {
    return url.split('/').slice(-1)[0].split('.').slice(0, -1).join('.')
  }

  /**
   * @param {any=} data
   */
  constructor(data = {}) {
    /**
     * {@link DataLoader#data}
     *
     * @private
     */
    this._data = data
  }

  /**
   * The `data` object.
   *
   * @public
   * @readonly
   */
  get data() {
    return this._data
  }

  /**
   * Load data from fetched json file.
   *
   * @public
   *
   * @param {string} url
   * @param {{ key?: string, target?: any }=} options
   *
   * @example
   * await dataLoader.loadFromJson('data/config.json', { key: 'config' })
   * console.log(dataLoader.data)
   * // => { config: { canvasSize: 320, tileSize: 16 } }
   */
  async loadFromJson(url, { key, target = this.data } = {}) {
    const jsonObject = await DataLoader.fetchJson(url)

    if (key === undefined) {
      for (const [k, v] of Object.entries(jsonObject)) {
        target[k] = v
      }
    } else {
      target[key] = jsonObject
    }
  }

  /**
   * Load one or more images.
   * Create an offscreen canvas element for each of them.
   *
   * @public
   *
   * @param {string | string[]} src
   * @param {{ scale?: number, key?: string, target?: any }=} options
   *
   * @example
   * await dataLoader.loadSImage('assets/knight.png')
   * console.log(dataLoader.data)
   * // => { knight: HTMLCanvasElement }
   */
  async loadImage(src, { scale, key, target = this.data } = {}) {
    if (typeof src === 'string') {
      src = [src]
    }

    const loading = src.map(
      url =>
        new Promise(resolve => {
          const image = new Image()
          image.src = url

          image.onload = () => {
            const offscreenCanvas = createOffscreenCanvas(image, scale)
            const imageName = DataLoader.getFileNameFrom(url)

            if (key === undefined) {
              target[imageName] = offscreenCanvas
            } else {
              if (target[key] === undefined) {
                target[key] = {}
              }
              target[key][imageName] = offscreenCanvas
            }

            image.onload = null
            resolve()
          }
        })
    )

    await Promise.all(loading)
  }

  /**
   * Load web font.
   * Add `@font-face` to style tag in `document.head`.
   *
   * @public
   *
   * @param {string | string[]} src
   */
  async loadFont(src) {
    if (typeof src === 'string') {
      src = [src]
    }

    const loading = src.map(
      url =>
        new Promise(resolve => {
          ;(async () => {
            const fontUrl = await DataLoader.fetchBlob(url)

            let styleTag = document.querySelector('style')
            if (styleTag === null) {
              styleTag = document.createElement('style')
              document.head.appendChild(styleTag)
            }

            styleTag.innerHTML += `
              @font-face {
                font-family: "${DataLoader.getFileNameFrom(url)}";
                src: url("${fontUrl}") format("ttf");
              }
            `
            resolve()
          })()
        })
    )

    await Promise.all(loading)
  }
}
