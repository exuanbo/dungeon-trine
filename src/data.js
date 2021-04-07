import { View } from './view.js'

/**
 * Animation entries from `animations.json`.
 *
 * @typedef {Object<string, {
 *    spriteSheet: string
 *    frames: Array<{
 *      sprite: [x: number, y: number, width: number, height: number]
 *      hitbox: [x: number, y: number, width: number, height: number]
 *      duration: number
 *    }>
 * }>} AnimationEntries
 */

export const data = {
  /**
   * Game configurations.
   *
   * @type {Object<string, unknown>}
   */
  config: undefined,

  /**
   * Game assets.
   *
   * @type {{ spriteSheets: Object<string, HTMLCanvasElement> }}
   */
  assets: {},

  /**
   * Game animation entries.
   *
   * @type {{ characters: Object<string, AnimationEntries> }}
   */
  animations: undefined
}

export class DataLoader {
  /**
   * Get data from json file in folder `data`.
   *
   * @private
   *
   * @param {string} fileName
   */
  static async getFromJson(fileName) {
    const response = await fetch(`data/${fileName}`)
    return await response.json()
  }

  /**
   * @param {data} data
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
   * Load game config from `data/config.json`.
   *
   * @private
   */
  async loadConfig() {
    this.data.config = await DataLoader.getFromJson('config.json')
  }

  /**
   * Load sprite sheets to `data` object.
   *
   * @private
   *
   * @param {Object<string, string>} spriteSheets
   */
  async loadSpriteSheets(spriteSheets) {
    this.data.assets.spriteSheets = {}

    const loading = []

    for (const spriteSheetName in spriteSheets) {
      this.data.assets.spriteSheets[spriteSheetName] = undefined

      const src = spriteSheets[spriteSheetName]

      loading.push(
        new Promise(resolve => {
          const image = new Image()
          image.src = src
          image.onload = () => {
            this.data.assets.spriteSheets[
              spriteSheetName
            ] = View.makeOffscreenCanvas(image)
            image.onload = null
            resolve()
          }
        })
      )
    }

    await Promise.all(loading)
  }

  /**
   * Load game assets from `data/assets.json`
   *
   * @private
   */
  async loadAssets() {
    const assets = await DataLoader.getFromJson('assets.json')

    await this.loadSpriteSheets(assets.spriteSheets)
  }

  /**
   * Load animations to `data` object.
   *
   * @private
   */
  async loadAnimations() {
    this.data.animations = await DataLoader.getFromJson('animations.json')
  }

  /**
   * Load all types of data.
   *
   * @public
   */
  async loadAll() {
    await this.loadConfig()
    await this.loadAssets()
    await this.loadAnimations()
  }
}