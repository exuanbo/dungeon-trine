import { Floor, Wall } from './tile.js'
import { CANVAS_SIZE, TILE_SIZE } from './globals.js'

export class Map {
  static getTiles() {
    const tiles = []

    const tilesPerSide = CANVAS_SIZE / TILE_SIZE

    for (let col = 0; col < tilesPerSide; col++) {
      const columnOfTiles = Array(tilesPerSide)
        .fill(undefined)
        .map((_, row) => {
          const position = { dx: col * TILE_SIZE, dy: row * TILE_SIZE }

          // left or right
          if (col === 0 || col === tilesPerSide - 1) {
            const sx = col === 0 ? 0 : 16

            if (row === 0) {
              return new Wall({
                imagePosition: { sx, sy: 112 }, // wall_side_top_left || wall_side_top_right
                position
              })
            }
            if (row === tilesPerSide - 1) {
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
          if (row === tilesPerSide - 1) {
            return new Wall({
              imagePosition: { sx: 32, sy: 12 },
              imageSize: { sWidth: TILE_SIZE, sHeight: TILE_SIZE + 4 },
              position: { dx: position.dx, dy: position.dy - 4 }
            })
          }

          return new Floor({ position })
        })

      tiles.push(...columnOfTiles)
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
