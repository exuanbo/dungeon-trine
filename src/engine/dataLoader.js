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
   * @param {(Object<string, any>)=} data
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
   *
   * @example
   * await dataLoader.loadFromJson('data/config.json')
   * console.log(dataLoader.data)
   * // => { config: { canvasSize: 320, tileSize: 16 } }
   */
  async loadFromJson(url) {
    const fileName = url.split('/').splice(-1)[0].split('.json')[0]

    this.data[fileName] = await DataLoader.fetchJson(url)
  }

  /**
   * Load sprite sheets from `Object<imageName, imageURL>`.
   * Create an offscreen canvas element for each of them.
   *
   * @public
   *
   * @param {Object<string, string>} spriteSheetsMap
   *
   * @example
   * await dataLoader.loadSpriteSheets({ knight: 'assets/knight.png' })
   * console.log(dataLoader.data)
   * // => { assets: { spriteSheets: { knight: HTMLCanvasElement } } }
   */
  async loadSpriteSheets(spriteSheetsMap) {
    if (this.data.assets === undefined) {
      this.data.assets = { spriteSheets: {} }
    } else if (this.data.assets.spriteSheets === undefined) {
      this.data.assets.spriteSheets = {}
    }
    const { assets } = this.data

    const loading = Object.keys(spriteSheetsMap).map(spriteSheetName => {
      assets.spriteSheets[spriteSheetName] = undefined

      return new Promise(resolve => {
        const image = new Image()
        image.src = spriteSheetsMap[spriteSheetName]

        image.onload = () => {
          assets.spriteSheets[spriteSheetName] = createOffscreenCanvas(image)
          image.onload = null
          resolve()
        }
      })
    })

    await Promise.all(loading)
  }
}
