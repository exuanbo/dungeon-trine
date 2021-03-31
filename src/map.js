import { Floor, Wall } from './tile.js'
import { WIDTH, HEIGHT, TILE_SIZE } from './globals.js'

class Map {
  static getTiles() {
    const tiles = []

    const colCount = WIDTH / TILE_SIZE
    const rowCount = HEIGHT / TILE_SIZE

    for (let col = 0; col < colCount; col++) {
      const lineOfTiles = Array(rowCount)
        .fill(undefined)
        .map((_, row) => {
          const position = { dx: col * TILE_SIZE, dy: row * TILE_SIZE }

          // left or right
          if (col === 0 || col === colCount - 1) {
            const sx = col === 0 ? 0 : 16

            if (row === 0) {
              return new Wall({
                imagePosition: { sx, sy: 112 }, // wall_side_top_left || wall_side_top_right
                position
              })
            }
            if (row === rowCount - 1) {
              return new Wall({
                imagePosition: { sx, sy: 144 }, // wall_side_front_left || wall_side_front_right
                position
              })
            }

            return new Wall({
              imagePosition: { sx, sy: 128 }, // wall_side_mid_left || wall_side_mid_left
              position
            })
          }

          // top
          if (row === 0 || row === 1) {
            return new Wall({
              imagePosition: { sx: 32, sy: row === 0 ? 0 : 16 }, // wall_top_mid || wall_mid
              position
            })
          }

          // bottom
          if (row === rowCount - 1) {
            return new Wall({
              imagePosition: { sx: 32, sy: 12 },
              imageSize: { sWidth: TILE_SIZE, sHeight: TILE_SIZE + 4 },
              position: { dx: position.dx, dy: position.dy - 4 }
            })
          }

          return new Floor({ position })
        })

      tiles.push(...lineOfTiles)
    }

    return tiles
  }

  constructor() {
    this.tiles = Map.getTiles()
  }

  draw() {
    this.tiles.forEach(tiles => {
      tiles.draw()
    })
  }
}

export default Map
