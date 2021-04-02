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
    const loading = []

    this.assetsList.forEach(asset => {
      switch (asset.type) {
        case 'image': {
          loading.push(
            new Promise(resolve => {
              const image = new Image()
              image.src = asset.src
              image.onload = () => {
                /**
                 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#pre-render_similar_primitives_or_repeating_objects_on_an_offscreen_canvas
                 * |Pre-render similar primitives or repeating objects on an offscreen canvas}
                 */
                const offscreenCanvas = document.createElement('canvas')
                offscreenCanvas.width = image.width
                offscreenCanvas.height = image.height
                offscreenCanvas.getContext('2d').drawImage(image, 0, 0)
                g.assets.image[asset.name] = offscreenCanvas
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
