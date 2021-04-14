import { createOffscreenCanvas } from './dom.js'

export class DataLoader {
  /**
   * Helper method using `fetch` API.
   *
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

            /**
             * @example
             * '0x72_DungeonTilesetII_v1.3'
             * // url: 'assets/0x72_DungeonTilesetII_v1.3.png'
             */
            const imageName = url
              .split('/')
              .slice(-1)[0]
              .split('.')
              .slice(0, -1)
              .join('.')

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
}
