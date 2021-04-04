import { View } from './view.js'
import g from './globals.js'

export class AssetLoader {
  constructor() {
    /**
     * Assets to load.
     *
     * @private
     */
    this.assetsList = [
      {
        name: 'dungeonTileSet',
        type: 'image',
        src: 'src/assets/0x72_DungeonTilesetII_v1.3.png'
      }
    ]

    this.assetsList.forEach(asset => {
      if (g.assets[asset.type] === undefined) {
        g.assets[asset.type] = {}
      }
      g.assets[asset.type][asset.name] = null
    })
  }

  /**
   * Load assets in `assetsList` and add them to global `assets`.
   *
   * @public
   */
  async load() {
    const loading = []

    this.assetsList.forEach(asset => {
      switch (asset.type) {
        case 'image': {
          loading.push(
            new Promise(resolve => {
              const image = new Image()
              image.src = asset.src
              image.onload = () => {
                g.assets.image[asset.name] = View.makeOffscreenCanvas(image)
                image.onload = null
                resolve()
              }
            })
          )
        }
      }
    })

    await Promise.all(loading)
  }
}
