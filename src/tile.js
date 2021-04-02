import g, { TILE_SIZE } from './globals.js'

class Tile {
  /**
   * @typedef {Object} TileMeta
   * @property {{ sx: number, sy: number }} TileMeta.imagePosition
   * @property {{ sWidth: number, sHeight: number }} [TileMeta.imageSize]
   * @property {{ dx: number, dy: number }} TileMeta.position
   */

  /**
   * @param {TileMeta} tileMeta
   */
  constructor({
    imagePosition,
    imageSize = { sWidth: TILE_SIZE, sHeight: TILE_SIZE },
    position
  }) {
    this.sprite = g.assets.image.dungeonTileSet

    this.isWall = false

    this.imagePosition = imagePosition
    this.imageSize = imageSize
    this.position = position
  }
}

export class Floor extends Tile {
  /**
   * @param {{ dx: number, dy: number }} position
   */
  constructor({ position }) {
    super({
      imagePosition: { sx: 16, sy: 64 }, // floor_1
      position
    })
  }
}

export class Wall extends Tile {
  /**
   * @param {TileMeta} tileMeta
   */
  constructor({ imagePosition, imageSize, position }) {
    super({ imagePosition, imageSize, position })
    this.isWall = true
  }
}
