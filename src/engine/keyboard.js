/**
 * @typedef {'keydown' | 'keyup' | 'both'} KeyboardEventType
 */

export class Keyboard {
  constructor() {
    /**
     * If the `init` has been called.
     *
     * @private
     */
    this.isInitialized = false

    /**
     * Keys Map.
     *
     * @private
     *
     * @type {Map<string, boolean>}
     *
     * @example
     * console.log(this.keysMap)
     * // => Map(1) {"ArrowUp" => true, "ArrowLeft" => true}
     */
    this.keysMap = new Map()

    /**
     * Listeners Map.
     *
     * @private
     *
     * @type {Map<
     *    number,
     *    [
     *      keyboardEventCode: string | string[],
     *      keyboardEventType: KeyboardEventType,
     *      cb: (key?: string, isKeyDown?: boolean) => void
     *    ]
     * >}
     */
    this.listeners = new Map()

    /**
     * The last listener's ID. Increased every time `listen` is called.
     *
     * @private
     */
    this.listenerId = 0

    /**
     * Keyboard event handler.
     *
     * @private
     *
     * @param {KeyboardEvent} e
     */
    this.handleEvent = e => {
      this.keysMap.set(e.code, e.type === 'keydown')

      for (const [key, isKeyDown] of this.keysMap) {
        for (const [
          keyboardEventCode,
          keyboardEventType,
          cb
        ] of this.listeners.values()) {
          if (
            (keyboardEventCode === key ||
              (Array.isArray(keyboardEventCode) &&
                keyboardEventCode.includes(key))) &&
            ((keyboardEventType === 'keydown') === isKeyDown ||
              keyboardEventType === 'both')
          ) {
            cb(key, isKeyDown)
          }
        }
      }
    }
  }

  /**
   * Start listening to `KeyboardEvent`.
   *
   * @public
   */
  init() {
    window.addEventListener('keydown', this.handleEvent, false)
    window.addEventListener('keyup', this.handleEvent, false)

    this.isInitialized = true
  }

  /**
   * Test if there is at least one key is down.
   *
   * @public
   */
  hasKeyDown() {
    for (const isKeyDown of this.keysMap.values()) {
      if (isKeyDown) {
        return true
      }
    }
    return false
  }

  /**
   * Listen to key event.
   * Return listener ID for `stopListen`.
   *
   * @public
   *
   * @param {string | string[]} keyboardEventCode
   * @param {KeyboardEventType} keyboardEventType
   * @param {(key?: string, isKeyDown?: boolean) => void} cb
   */
  listen(keyboardEventCode, keyboardEventType, cb) {
    if (!this.isInitialized) {
      throw new Error("'Keyboard.init' has to be called first.")
    }

    const listenerId = ++this.listenerId
    this.listeners.set(listenerId, [keyboardEventCode, keyboardEventType, cb])

    return listenerId
  }

  /**
   * Stop the listener with the passed `listenerId`.
   * Throw an error if `listenerId` does not exist.
   *
   * @public
   *
   * @param {number} listenerId
   */
  stopListen(listenerId) {
    if (!this.listeners.has(listenerId)) {
      throw new Error(`ListenerId '${listenerId}' does not exist.`)
    }

    this.listeners.delete(listenerId)
  }

  /**
   * Stop all the listeners.
   *
   * @public
   */
  stopAll() {
    this.listeners.clear()
  }

  /**
   *  Call `stopAll` and remove the window event listeners.
   *
   * @public
   */
  destroy() {
    this.stopAll()

    window.removeEventListener('keydown', this.handleEvent, false)
    window.removeEventListener('keyup', this.handleEvent, false)

    this.isInitialized = false
  }
}
