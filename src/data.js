/**
 * @typedef {{
 *    config: Object<string, any>
 *    assets: {
 *      images: Object<string, HTMLCanvasElement>
 *    }
 *    animations: {
 *      characters: Object<
 *        string,
 *        import('./scenes/utils').AnimationEntries
 *      >
 *    }
 * }} Data
 */

/**
 * The global `data` object.
 *
 * Initialized by `DataLoader`
 *
 */
export const data = /** @type {Data} */ ({
  config: undefined,
  assets: { images: undefined },
  animations: undefined
})
