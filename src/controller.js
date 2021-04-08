import { data, DataLoader } from './data.js'
import { Game } from './game.js'
import { View } from './view.js'

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

    switch (this.game.scene.name) {
      case 'game': {
        /** @type {import('./gameScene/gameLayer').GameLayer} */
        const gameLayer = this.game.scene.layers.get('game')

        for (const [k, v] of this.keyboardMap) {
          switch (k) {
            case 'ArrowUp':
            case 'ArrowRight':
            case 'ArrowDown':
            case 'ArrowLeft':
              {
                const direction = k.slice(5).toLowerCase()
                gameLayer.player.directions.set(direction, v)
              }
              continue
            case 'KeyX':
              gameLayer.player.willAttack = v
          }
        }

        if (!isKeydown) {
          // The player should not stop if exists at least one key down.
          for (const v of this.keyboardMap.values()) {
            if (v) {
              return
            }
          }

          gameLayer.player.willStop = true
        }
      }
    }
  }
}
