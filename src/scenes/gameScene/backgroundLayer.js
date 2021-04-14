import { Layer } from '../../engine/layer.js'
import { Tile, Floor } from '../tile.js'
import { data } from '../../data.js'

export class BackgroundLayer extends Layer {
  /**
   * Generate an array of `Tile`.
   *
   * @public
   * @static
   */
  static getTiles() {
    const { config } = data

    const tiles = []

    const tilesPerRow = config.width / config.tileSize
    const tilesPerColumn = config.height / config.tileSize

    for (let col = 0; col < tilesPerRow; col++) {
      const columnOfTiles = []
      const dx = col * config.tileSize

      for (let row = 0; row < tilesPerColumn; row++) {
        let tile
        const dy = row * config.tileSize

        // left or right side wall
        if (col === 0 || col === tilesPerRow - 1) {
          const sx = col === 0 ? 0 : 32

          if (row === 0) {
            tile = new Tile(
              sx,
              /* sy */ 224,
              config.tileSize,
              config.tileSize,
              dx,
              dy
            ) // wall_side_top_left || wall_side_top_right
          } else if (row === tilesPerColumn - 1) {
            tile = new Tile(
              sx,
              /* sy */ 288,
              config.tileSize,
              config.tileSize,
              dx,
              dy
            ) // wall_side_front_left || wall_side_front_right
          } else {
            tile = new Tile(
              sx,
              /* sy */ 256,
              config.tileSize,
              config.tileSize,
              dx,
              dy
            ) // wall_side_mid_left || wall_side_mid_left
          }
        }

        // top side wall
        else if (row === 0 || row === 1) {
          tile = new Tile(
            /* sx */ 64,
            /* sy */ row === 0 ? 0 : 32,
            config.tileSize,
            config.tileSize,
            dx,
            dy
          ) // wall_top_mid || wall_mid
        }

        // bottom side wall
        else if (row === tilesPerColumn - 1) {
          tile = new Tile(
            /* sx */ 64,
            /* sy */ 24,
            /* sWidth */ config.tileSize,
            /* sHeight */ config.tileSize + 8,
            dx,
            dy - 8
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
   * @param {import('../../engine/scene').Scene} scene
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
   * @override
   * @public
   */
  update() {}

  /**
   * Render tiles to the layer canvas once.
   *
   * @override
   * @public
   */
  render() {
    if (!this.isDirty) {
      return
    }

    this.ctx.clearRect(0, 0, this.scene.width, this.scene.height)

    this.tiles.forEach(tile => {
      tile.sprite.render(this.ctx, tile.position.x, tile.position.y)
    })

    this.isDirty = false
  }
}
