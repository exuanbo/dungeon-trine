import {
  Sprite,
  Animation,
  AnimationFrame,
  vector,
  Box
} from '../engine/index.js'

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
 * >} AnimationDetailsMap
 */

/**
 * Create `<animationName, Animation>` map from provided animation entries.
 *
 * @param {Object<string, HTMLImageElement | HTMLCanvasElement> } spriteSheets
 * @param {AnimationDetailsMap} animationDetailsMap
 */
export const createAnimationsMap = (spriteSheets, animationDetailsMap) => {
  /** @type {import('../engine').AnimationsMap} */
  const animationsMap = {}

  for (const [animationName, animationDetails] of Object.entries(
    animationDetailsMap
  )) {
    const spriteSheet = spriteSheets[animationDetails.spriteSheet]

    const animationFrames = animationDetails.frames.map(frame => {
      const sprite = new Sprite(spriteSheet, ...frame.sprite)

      /** @type {Box | undefined} */
      let box

      if (frame.box !== undefined) {
        const [x, y, width, height] = frame.box

        box = new Box(width, height, /* boxPosition */ { offset: vector(x, y) })
      }

      return new AnimationFrame({ sprite, box, duration: frame.duration })
    })

    animationsMap[animationName] = new Animation(animationFrames)
  }

  return animationsMap
}
