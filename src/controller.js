import { DataLoader } from './engine/dataLoader.js'
import { data } from './data.js'
import { Game } from './engine/game.js'
import { GameScene } from './scenes/gameScene/index.js'
import { GameRenderer } from './engine/gameRenderer.js'

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
   * Load all the game data.
   *
   * @private
   */
  async loadData() {
    const loadConfig = this.dataLoader.loadFromJson('data/config.json')
    const loadSpriteSheets = new Promise(resolve => {
      ;(async () => {
        const assets = await DataLoader.fetchJson('data/assets.json')
        await this.dataLoader.loadSpriteSheets(assets.spriteSheets)
        resolve()
      })()
    })
    const loadAnimations = this.dataLoader.loadFromJson('data/animations.json')

    await Promise.all([loadConfig, loadSpriteSheets, loadAnimations])
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
        /** @type {import('./scenes/gameScene/gameLayer').GameLayer} */
        const gameLayer = this.game.scene.layers.get('game')

        for (const [k, v] of this.keyboardMap) {
          switch (k) {
            case 'ArrowUp':
            case 'ArrowRight':
            case 'ArrowDown':
            case 'ArrowLeft':
              gameLayer.player.directions.set(k.slice(5), v)
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

  /**
   * Initialize the controller.
   *
   * Load assets then render the game and listen to keyboard.
   *
   * @public
   */
  async init() {
    await this.loadData()

    this.game = new Game(new GameScene())
    this.gameRenderer = new GameRenderer(/* fps */ 60)
    this.gameRenderer.render(this.game)

    window.addEventListener('keydown', e => this.handleKey(e), false)
    window.addEventListener('keyup', e => this.handleKey(e), false)
  }
}
