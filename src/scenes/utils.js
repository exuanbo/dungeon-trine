import {
  Sprite,
  Animation,
  AnimationFrame,
  vector,
  Box,
  randomInt
} from '../engine/index.js'
import { data } from '../data.js'

/**
 * Animation details map from `data`.
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
 * Create `<animationName, Animation>` map from passed animation details map.
 *
 * @param {AnimationDetailsMap} animationDetailsMap
 */
export const createAnimationsMap = animationDetailsMap => {
  /** @type {import('../engine').AnimationsMap} */
  const animationsMap = {}

  for (const [animationName, animationDetails] of Object.entries(
    animationDetailsMap
  )) {
    const spriteSheet = data.assets.images[animationDetails.spriteSheet]

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

/**
 * Create a random position `Vector`.
 *
 * @param {number} offsetX
 * @param {number} offsetY
 */
export const randomPosition = (offsetX, offsetY) => {
  const { width, height, tileSize } = data.config

  return vector(
    /* x */ randomInt(
      /* min */ tileSize + offsetX,
      /* max */ width - tileSize - offsetX
    ),
    /* y */ randomInt(
      /* min */ tileSize * 2 + offsetY,
      /* max */ height - tileSize - 8 - offsetY
    )
  )
}
