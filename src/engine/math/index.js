export * from './vector.js'

export * from './box.js'

/**
 * {@link https://stackoverflow.com/a/1527820/13346012
 * |Generating random whole numbers in JavaScript in a specific range?}
 *
 * @param {number} min
 * @param {number} max
 */
export const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
