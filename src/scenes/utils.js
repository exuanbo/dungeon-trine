import { Animation, AnimationFrame } from '../engine/gameObjects/animation.js'
import { Sprite } from '../engine/gameObjects/sprite.js'
import { Box } from '../engine/math/box.js'
import { vector } from '../engine/math/vector.js'

/**
 * Animation entries object from `data`.
 *
 * @typedef {Object<
 *    string,
 *    {
 *      spriteSheet: string
 *      frames: Array<{
 *        sprite: [x: number, y: number, width: number, height: number]
 *        box?: [offsetX: number, offsetY: number, width: number, height: number]
 *        duration?: number
 *      }>
 *    }
 * >} AnimationEntries
 */

/**
 * Create `<animationName, Animation>` map from provided animation entries.
 *
 * @param {Object<string, HTMLImageElement | HTMLCanvasElement> } spriteSheets
 * @param {AnimationEntries} animationEntries
 */
export const createAnimationsMap = (spriteSheets, animationEntries) => {
  /** @type {import('../engine/gameObjects/animation').AnimationsMap} */
  const animationsMap = {}

  for (const animationName in animationEntries) {
    const animationEntry = animationEntries[animationName]

    const spriteSheet = spriteSheets[animationEntry.spriteSheet]

    const animationFrames = animationEntry.frames.map(frame => {
      /** @type {Box | undefined} */
      let box

      if (frame.box !== undefined) {
        const [boxOffsetX, boxOffsetY, boxWidth, boxHeight] = frame.box

        box = new Box(boxWidth, boxHeight, {
          offset: vector(boxOffsetX, boxOffsetY)
        })
      }

      return new AnimationFrame({
        sprite: new Sprite(spriteSheet, ...frame.sprite),
        box,
        duration: frame.duration
      })
    })

    animationsMap[animationName] = new Animation(animationFrames)
  }

  return animationsMap
}
