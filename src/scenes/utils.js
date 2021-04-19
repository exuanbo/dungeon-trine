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
 * Callback if the game object is colliding with wall.
 *
 * @param {() => void} cb
 * @param {{
 *    animationFrame: AnimationFrame
 *    position: import('../engine').Vector
 * }} gameObjectConfig
 */
export const handleCollisionWithWall = (cb, { animationFrame, position }) => {
  const hitbox = animationFrame.getBox(position)
  const hitboxActualPosition = hitbox.getActualPosition()

  const { config } = data

  if (
    hitboxActualPosition.x <= config.tileSize ||
    hitboxActualPosition.x + hitbox.width >= config.width - config.tileSize ||
    position.y <= config.tileSize ||
    position.y + animationFrame.sprite.height >=
      config.height - config.tileSize - 4
  ) {
    cb()
  }
}

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
 * @param {number} horizontalOffset
 * @param {number} verticalOffset
 */
export const randomPosition = (horizontalOffset, verticalOffset) => {
  const { width, height, tileSize } = data.config

  return vector(
    /* x */ randomInt(
      /* min */ tileSize + horizontalOffset,
      /* max */ width - tileSize - horizontalOffset
    ),
    /* y */ randomInt(
      /* min */ tileSize * 2 + verticalOffset,
      /* max */ height - tileSize - 8 - verticalOffset
    )
  )
}
