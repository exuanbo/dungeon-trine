import g from './globals.js'

export class AssetLoader {
  constructor() {
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

  async load() {
    const download = []

    this.assetsList.forEach(asset => {
      switch (asset.type) {
        case 'image': {
          download.push(
            new Promise(resolve => {
              const image = new Image()
              image.src = asset.src
              image.onload = () => {
                g.assets.image[asset.name] = image
                resolve()
              }
            })
          )
        }
      }
    })

    await Promise.all(download)
  }
}
