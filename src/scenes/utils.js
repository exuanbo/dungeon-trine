import {
  Sprite,
  Animation,
  AnimationFrame,
  vector,
  BoundingBox,
  randomInt
} from '../engine/index.js'
import { data } from '../data.js'

/**
 * Callback if the game object is colliding with wall.
 *
 * @param {() => void} cb
 * @param {{
 *    animationFrame: AnimationFrame
 *    boundingBox: BoundingBox
 * }} gameObjectConfig
 */
export const handleCollisionWithWall = (
  cb,
  { animationFrame, boundingBox }
) => {
  const boundingBoxActualPosition = boundingBox.getActualPosition()

  const { config } = data

  if (
    boundingBoxActualPosition.x <= config.tileSize ||
    boundingBoxActualPosition.x + boundingBox.width >=
      config.width - config.tileSize ||
    boundingBox.position.y <= config.tileSize ||
    boundingBox.position.y + animationFrame.sprite.height >=
      config.height - config.tileSize - 16
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
 *        boundingBox?: [
 *          offsetX: number,
 *          offsetY: number,
 *          width: number,
 *          height: number
 *        ]
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

      /** @type {BoundingBox | undefined} */
      let boundingBox

      if (frame.boundingBox !== undefined) {
        const [x, y, width, height] = frame.boundingBox

        boundingBox = new BoundingBox(
          width,
          height,
          /* boxPosition */ { offset: vector(x, y) }
        )
      }

      return new AnimationFrame({
        sprite,
        boundingBox,
        duration: frame.duration
      })
    })

    animationsMap[animationName] = new Animation(animationFrames)
  }

  return animationsMap
}

/**
 * Create a random position `Vector`.
 *
 * @param {number=} horizontalOffset
 * @param {number=} verticalOffset
 */
export const randomPosition = (
  horizontalOffset = 128,
  verticalOffset = 128
) => {
  const { width, height, tileSize } = data.config

  return vector(
    /* x */ randomInt(
      /* min */ tileSize + horizontalOffset,
      /* max */ width - tileSize - horizontalOffset
    ),
    /* y */ randomInt(
      /* min */ tileSize * 2 + verticalOffset,
      /* max */ height - tileSize - 16 - verticalOffset
    )
  )
}
