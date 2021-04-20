import { Layer } from '../../engine/index.js'
import { Tile, Floor } from '../tile.js'
import { data } from '../../data.js'

/**
 * @extends {Layer<import('.').GameScene>}
 */
export class BackgroundLayer extends Layer {
  /**
   * Generate an array of `Tile`.
   *
   * @public
   * @static
   */
  static getTiles() {
    const tiles = []

    const { config } = data

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
          const sx = col === 0 ? 0 : 64

          if (row === 0) {
            tile = new Tile(
              sx,
              /* sy */ 448,
              /* sWidth */ config.tileSize,
              /* sHeight */ config.tileSize,
              dx,
              dy
            )
          } else if (row === tilesPerColumn - 1) {
            tile = new Tile(
              sx,
              /* sy */ 576,
              /* sWidth */ config.tileSize,
              /* sHeight */ config.tileSize,
              dx,
              dy
            )
          } else {
            tile = new Tile(
              sx,
              /* sy */ 512,
              /* sWidth */ config.tileSize,
              /* sHeight */ config.tileSize,
              dx,
              dy
            )
          }
        }

        // top side wall
        else if (row === 0 || row === 1) {
          tile = new Tile(
            /* sx */ 128,
            /* sy */ row === 0 ? 0 : 64,
            /* sWidth */ config.tileSize,
            /* sHeight */ config.tileSize,
            dx,
            dy
          )
        }

        // bottom side wall
        else if (row === tilesPerColumn - 1) {
          tile = new Tile(
            /* sx */ 128,
            /* sy */ 48,
            /* sWidth */ config.tileSize,
            /* sHeight */ config.tileSize + 16,
            dx,
            dy - 16
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
   * @param {import('.').GameScene} scene
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

    this.ctx.clearRect(
      /* x */ 0,
      /* y */ 0,
      /* w */ this.scene.width,
      /* h */ this.scene.height
    )

    this.tiles.forEach(tile => {
      tile.sprite.render(
        /* ctx */ this.ctx,
        /* dx */ tile.position.x,
        /* dy */ tile.position.y
      )
    })

    this.isDirty = false
  }
}
