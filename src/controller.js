import { data, DataLoader } from './data.js'
import { Game } from './game.js'
import { View } from './view.js'

const ARROW_KEY_CODES = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']

export class Controller {
  constructor() {
    /**
     * Initialize a new data laoder.
     *
     * @private
     */
    this.dataLoader = new DataLoader(data)

    /**
     * Keyboard key map. For handling multiple `keydown`.
     *
     * @private
     *
     * @type {Map<string, boolean>}
     */
    this.keyboardMap = new Map()
  }

  /**
   * Initialize controller.
   *
   * Load assets then render the game and listen to keyboard.
   *
   * @public
   */
  async init() {
    await this.dataLoader.loadAll()

    this.game = new Game()
    this.player = this.game.scene.layers.game.player
    this.view = new View()
    this.view.render(this.game)

    window.addEventListener('keydown', e => this.handleKey(e), false)
    window.addEventListener('keyup', e => this.handleKey(e), false)
  }

  /**
   * Handle `keydown` and `keyup` event.
   *
   * @private
   *
   * @param {KeyboardEvent} e
   */
  handleKey(e) {
    const isKeydown = e.type === 'keydown'
    this.keyboardMap.set(e.code, isKeydown)

    for (const [k, v] of this.keyboardMap) {
      if (ARROW_KEY_CODES.includes(k)) {
        const direction = k.slice(5).toLowerCase()
        this.player.directions[direction] = v
      }
      if (k === 'KeyX') {
        this.player.willAttack = v
      }
    }

    if (!isKeydown) {
      for (const v of this.keyboardMap.values()) {
        if (v) {
          return
        }
      }

      this.player.willStop = true
    }
  }
}
