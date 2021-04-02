import { Layer } from '../layer.js'
import { Floor, Wall } from '../tile.js'
import { CANVAS_SIZE, TILE_SIZE } from '../globals.js'

export class BackgroundLayer extends Layer {
  static getTiles() {
    const tiles = []

    const tilesPerSide = CANVAS_SIZE / TILE_SIZE

    for (let col = 0; col < tilesPerSide; col++) {
      const columnOfTiles = []

      for (let row = 0; row < tilesPerSide; row++) {
        let tile
        const position = { dx: col * TILE_SIZE, dy: row * TILE_SIZE }

        // left or right side wall
        if (col === 0 || col === tilesPerSide - 1) {
          const sx = col === 0 ? 0 : 16

          if (row === 0) {
            tile = new Wall({
              imagePosition: { sx, sy: 112 }, // wall_side_top_left || wall_side_top_right
              position
            })
          } else if (row === tilesPerSide - 1) {
            tile = new Wall({
              imagePosition: { sx, sy: 144 }, // wall_side_front_left || wall_side_front_right
              position
            })
          } else {
            tile = new Wall({
              imagePosition: { sx, sy: 128 }, // wall_side_mid_left || wall_side_mid_left
              position
            })
          }
        }

        // top side wall
        else if (row === 0 || row === 1) {
          tile = new Wall({
            imagePosition: { sx: 32, sy: row === 0 ? 0 : 16 }, // wall_top_mid || wall_mid
            position
          })
        }

        // bottom side wall
        else if (row === tilesPerSide - 1) {
          tile = new Wall({
            imagePosition: { sx: 32, sy: 12 },
            imageSize: { sWidth: TILE_SIZE, sHeight: TILE_SIZE + 4 },
            position: { dx: position.dx, dy: position.dy - 4 }
          })
        }

        // floor
        else {
          tile = new Floor({ position })
        }

        columnOfTiles.push(tile)
      }

      tiles.push(...columnOfTiles)
    }

    return tiles
  }

  constructor() {
    super()
    this.isRendered = false
    this.tiles = BackgroundLayer.getTiles()
  }

  render() {
    if (this.isRendered) {
      return
    }

    this.tiles.forEach(tile => {
      const { sx, sy } = tile.imagePosition
      const { sWidth, sHeight } = tile.imageSize
      const { dx, dy } = tile.position

      this.ctx.clearRect(dx, dy, sWidth, sHeight)
      this.ctx.drawImage(
        tile.sprite,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        sWidth,
        sHeight
      )
    })
    this.isRendered = true
  }
}
