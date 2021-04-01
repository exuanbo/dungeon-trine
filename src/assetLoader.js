import g from './globals.js'

export class AssetLoader {
  constructor() {
    const assetsList = [
      {
        name: 'dungeonTileSet',
        type: 'image',
        src: 'src/assets/0x72_DungeonTilesetII_v1.3.png'
      }
    ]

    assetsList.forEach(asset => {
      if (g.assets[asset.type] === undefined) {
        g.assets[asset.type] = {}
      }
      g.assets[asset.type][asset.name] = {
        src: asset.src,
        element: null,
        isLoaded: false
      }
    })
  }

  async load() {
    const download = []

    for (const assetType in g.assets) {
      const assets = g.assets[assetType]

      switch (assetType) {
        case 'image': {
          for (const assetName in assets) {
            const asset = assets[assetName]

            download.push(
              new Promise(resolve => {
                const image = new Image()
                image.src = asset.src
                image.onload = () => {
                  asset.element = image
                  asset.isLoaded = true
                  resolve()
                }
              })
            )
          }
        }
      }
    }

    await Promise.all(download)
  }
}
