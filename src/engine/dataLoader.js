import { createOffscreenCanvas } from './dom.js'

export class DataLoader {
  /**
   * Helper method using `fetch` API.
   *
   * @public
   *
   * @param {string} url
   */
  static async fetchJson(url) {
    const response = await fetch(url)
    return await response.json()
  }

  /**
   * @param {Object<string, any>} data
   */
  constructor(data) {
    /**
     * The global `data` object.
     *
     * @private
     */
    this.data = data
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
   * dataLoader.data // => { config: { canvasSize: 320, tileSize: 16 } }
   */
  async loadFromJson(url) {
    const fileName = url.split('/').splice(-1)[0].split('.')[0]

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
   * dataLoader.data // => { assets: { spriteSheets: { knight: HTMLCanvasElement } } }
   */
  async loadSpriteSheets(spriteSheetsMap) {
    if (this.data.assets === undefined) {
      this.data.assets = {}
    }
    if (this.data.assets.spriteSheets === undefined) {
      this.data.assets.spriteSheets = {}
    }
    const { assets } = this.data

    const loading = Object.keys(spriteSheetsMap).map(spriteSheetName => {
      assets.spriteSheets[spriteSheetName] = undefined

      return new Promise(resolve => {
        let image = new Image()
        image.src = spriteSheetsMap[spriteSheetName]

        image.onload = () => {
          assets.spriteSheets[spriteSheetName] = createOffscreenCanvas(image)
          image.onload = null
          image = null
          resolve()
        }
      })
    })

    await Promise.all(loading)
  }
}
