import { DataLoader } from './engine/dataLoader.js'
import { data } from './data.js'
import { Keyboard } from './engine/keyboard.js'
import { Game } from './engine/game.js'
import { GameScene } from './scenes/gameScene/index.js'
import { GameRenderer } from './engine/gameRenderer.js'

export class Controller {
  constructor() {
    /**
     * Initialize a new `DataLoader`.
     *
     * @private
     */
    this.dataLoader = new DataLoader(data)

    /**
     * Initialize a new `Keyboard`.
     *
     * @private
     */
    this.keyboard = new Keyboard()
  }

  /**
   * Load all the game data.
   *
   * @private
   */
  async loadData() {
    const loadConfig = this.dataLoader.loadFromJson('data/config.json')

    data.assets = { spriteSheets: {} }

    const loadSpriteSheets = new Promise(resolve => {
      ;(async () => {
        const assets = await DataLoader.fetchJson('data/assets.json')
        await this.dataLoader.loadImage(
          assets.spriteSheets,
          data.assets.spriteSheets
        )
        resolve()
      })()
    })

    const loadAnimations = this.dataLoader.loadFromJson('data/animations.json')

    await Promise.all([loadConfig, loadSpriteSheets, loadAnimations])
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

    this.gameRenderer = new GameRenderer()
    this.gameRenderer.render(this.game)

    this.keyboard.init()

    const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'KeyX']

    this.keyboard.listen(keys, 'both', (key, isKeyDown) => {
      switch (this.game.scene.name) {
        case 'game': {
          const gameLayer =
            /**
             * @type {import('./scenes/gameScene/gameLayer').GameLayer}
             */
            (this.game.scene.layers.get('game'))

          switch (key) {
            case 'ArrowUp':
            case 'ArrowRight':
            case 'ArrowDown':
            case 'ArrowLeft':
              gameLayer.player.directions.set(
                /**
                 * @type {import('./engine/gameObjects/models/movableObject').Direction}
                 *
                 * @example
                 * 'Right'
                 * // key: 'ArrowRight'
                 */
                (key.slice(5)),
                isKeyDown
              )
              break
            case 'KeyX':
              gameLayer.player.willAttack = isKeyDown
              break
          }

          if (!this.keyboard.hasKeyDown()) {
            gameLayer.player.willStop = true
          }
        }
      }
    })
  }
}
