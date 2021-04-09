import { Layer } from '../engine/layer.js'
import { Tile, Floor } from '../tile.js'
import { data } from '../data.js'

export class BackgroundLayer extends Layer {
  /**
   * Generate an array of `Tile`.
   *
   * @public
   * @static
   */
  static getTiles() {
    const { canvasSize, tileSize } = data.config

    const tiles = []

    const tilesPerSide = canvasSize / tileSize

    for (let col = 0; col < tilesPerSide; col++) {
      const columnOfTiles = []

      for (let row = 0; row < tilesPerSide; row++) {
        let tile
        const dx = col * tileSize
        const dy = row * tileSize

        // left or right side wall
        if (col === 0 || col === tilesPerSide - 1) {
          const sx = col === 0 ? 0 : 16

          if (row === 0) {
            tile = new Tile(sx, /* sy */ 112, tileSize, tileSize, dx, dy) // wall_side_top_left || wall_side_top_right
          } else if (row === tilesPerSide - 1) {
            tile = new Tile(sx, /* sy */ 144, tileSize, tileSize, dx, dy) // wall_side_front_left || wall_side_front_right
          } else {
            tile = new Tile(sx, /* sy */ 128, tileSize, tileSize, dx, dy) // wall_side_mid_left || wall_side_mid_left
          }
        }

        // top side wall
        else if (row === 0 || row === 1) {
          tile = new Tile(
            /* sx */ 32,
            /* sy */ row === 0 ? 0 : 16,
            tileSize,
            tileSize,
            dx,
            dy
          ) // wall_top_mid || wall_mid
        }

        // bottom side wall
        else if (row === tilesPerSide - 1) {
          tile = new Tile(
            /* sx */ 32,
            /* sy */ 12,
            /* sWidth */ tileSize,
            /* sHeight */ tileSize + 4,
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

  /**
   * @param {import('../engine/scene').Scene} scene
   */
  constructor(scene) {
    super(scene)

    /**
     * The generated tiles.
     *
     * @private
     */
    this.tiles = BackgroundLayer.getTiles()
  }

  /**
   * The implemented `Layer.render` method.
   *
   * Render tiles to the layer once.
   *
   * @override
   * @public
   */
  render() {
    if (!this.isDirty) {
      return
    }

    const { canvasSize } = data.config

    this.ctx.clearRect(0, 0, canvasSize, canvasSize)
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
    this.isDirty = false
  }
}
