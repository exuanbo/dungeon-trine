import { vector } from './vector.js'

export class Sprite {
  /**
   * @param {HTMLImageElement | HTMLCanvasElement} spriteSheet
   * @param {Array<[
   *    name: string,
   *    x: number,
   *    y: number,
   *    width: number,
   *    height: number,
   *    count: number
   * ]>} entries
   *
   * @returns {Object<string, [Sprite]>} frames
   */
  static makeFrames(spriteSheet, entries) {
    const frames = {}

    entries.forEach(([name, x, y, width, height, count]) => {
      frames[name] = []
      for (let i = 0; i < count; i++) {
        frames[name].push(
          new Sprite(spriteSheet, x + i * width, y, width, height)
        )
      }
    })

    return frames
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement} spriteSheet
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(spriteSheet, x, y, width, height) {
    this.spriteSheet = spriteSheet
    this.position = vector(x, y)
    this.width = width
    this.height = height
  }
}
