import { AttackerCharacter } from '../character.js'
import { Sprite } from '../sprite.js'
import { vector } from '../vector.js'
import g, { CANVAS_SIZE, TILE_SIZE } from '../globals.js'

/**
 * User controlled character.
 */
export class Player extends AttackerCharacter {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    const spriteSheet = g.assets.image.dungeonTileSet
    const framesMap = Sprite.makeFramesMap(spriteSheet, [
      ['idle', 128, 100, 16, 28, 4],
      ['move', 192, 100, 16, 28, 4],
      ['attack', 256, 100, 16, 28, 1, 12]
    ])

    const position = vector(CANVAS_SIZE / 2 - TILE_SIZE / 2)

    super({ framesMap, position, ctx })
  }
}
