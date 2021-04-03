import { Layer } from '../layer.js'
import { Tile, Floor } from '../tile.js'
import { CANVAS_SIZE, TILE_SIZE } from '../globals.js'

export class BackgroundLayer extends Layer {
  static getTiles() {
    const tiles = []

    const tilesPerSide = CANVAS_SIZE / TILE_SIZE

    for (let col = 0; col < tilesPerSide; col++) {
      const columnOfTiles = []

      for (let row = 0; row < tilesPerSide; row++) {
        let tile
        const dx = col * TILE_SIZE
        const dy = row * TILE_SIZE

        // left or right side wall
        if (col === 0 || col === tilesPerSide - 1) {
          const sx = col === 0 ? 0 : 16

          if (row === 0) {
            tile = new Tile(sx, /* sy */ 112, TILE_SIZE, TILE_SIZE, dx, dy) // wall_side_top_left || wall_side_top_right
          } else if (row === tilesPerSide - 1) {
            tile = new Tile(sx, /* sy */ 144, TILE_SIZE, TILE_SIZE, dx, dy) // wall_side_front_left || wall_side_front_right
          } else {
            tile = new Tile(sx, /* sy */ 128, TILE_SIZE, TILE_SIZE, dx, dy) // wall_side_mid_left || wall_side_mid_left
          }
        }

        // top side wall
        else if (row === 0 || row === 1) {
          tile = new Tile(
            /* sx */ 32,
            /* sy */ row === 0 ? 0 : 16,
            TILE_SIZE,
            TILE_SIZE,
            dx,
            dy
          ) // wall_top_mid || wall_mid
        }

        // bottom side wall
        else if (row === tilesPerSide - 1) {
          tile = new Tile(
            /* sx */ 32,
            /* sy */ 12,
            /* sWidth */ TILE_SIZE,
            /* sHeight */ TILE_SIZE + 4,
            dx,
            dy - 4
          )
        }

        // floor
        else {
          tile = new Floor(dx, dy)
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

    this.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    this.tiles.forEach(tile => {
      const { sprite, position } = tile

      this.ctx.drawImage(
        sprite.spriteSheet,
        sprite.position.x,
        sprite.position.y,
        sprite.width,
        sprite.height,
        position.x,
        position.y,
        sprite.width,
        sprite.height
      )
    })
    this.isRendered = true
  }
}
