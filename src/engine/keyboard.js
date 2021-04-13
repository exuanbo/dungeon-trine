/**
 * @typedef {'keydown' | 'keyup' | 'both'} KeyboardEventType
 */

export class Keyboard {
  constructor() {
    /**
     * If `init` has been called.
     *
     * @private
     */
    this.isInitialized = false

    /**
     * Keyboard keys `Map`.
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
     * Listeners `Map`.
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
     * Keyboard event handler function.
     *
     * @private
     *
     * @param {KeyboardEvent} e
     */
    this.handleEvent = e => {
      const isKeydown = e.type === 'keydown'

      if (this.keysMap.get(e.code) === isKeydown) {
        return
      }

      this.keysMap.set(e.code, isKeydown)

      for (const [
        keyboardEventCode,
        keyboardEventType,
        cb
      ] of this.listeners.values()) {
        if (
          (keyboardEventCode === e.code ||
            (Array.isArray(keyboardEventCode) &&
              keyboardEventCode.includes(e.code))) &&
          ((keyboardEventType === 'keydown') === isKeydown ||
            keyboardEventType === 'both')
        ) {
          cb(e.code, isKeydown)
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
   * Test if there is at least one keyboard key is down.
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
   * Listen to key event and return listener ID for `stopListen`.
   *
   * Throw an error if `init` has not been called.
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
