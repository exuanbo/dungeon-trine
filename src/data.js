/**
 * @typedef {{
 *    config: Object<string, any>
 *    assets: {
 *      spriteSheets: Object<string, HTMLCanvasElement>
 *    }
 *    animations: {
 *      characters: Object<
 *        string,
 *        import('./engine/gameObjects/animation').AnimationEntries
 *      >
 *    }
 * }} Data
 */

/**
 * The global `data` object.
 *
 * Initialized by `DataLoader`
 *
 * @type {Data}
 */
export const data = {}
