import { DataLoader, Keyboard, Game, GameRenderer } from './engine/index.js'
import { data } from './data.js'
import { GameScene } from './scenes/gameScene/index.js'

export class GameController {
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
    const loadConfig = this.dataLoader.loadFromJson(
      /* url */ 'data/config.json',
      /* options */ { key: 'config' }
    )

    const loadSpriteSheets = new Promise(resolve => {
      ;(async () => {
        const assets = await DataLoader.fetchJson(/* url */ 'data/assets.json')
        await this.dataLoader.loadImage(
          /* src */ assets.images,
          /* options */ {
            scale: 4,
            key: 'images',
            target: data.assets
          }
        )
        resolve()
      })()
    })

    const loadAnimations = this.dataLoader.loadFromJson(
      /* url */ 'data/animations.json',
      /* options */ { key: 'animations' }
    )

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

    this.game = new Game(/* initialScene */ new GameScene())

    this.gameRenderer = new GameRenderer()
    this.gameRenderer.render(/* game */ this.game)

    this.keyboard.init()

    const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'KeyX']

    this.keyboard.listen(
      /* keyboardEventCode */ keys,
      /* keyboardEventType */ 'both',
      /* cb */ (key, isKeyDown) => {
        switch (this.game.scene.name) {
          case 'game': {
            const gameLayer =
              /**
               * @type {import('./scenes/gameScene/gameLayer').GameLayer}
               */
              (this.game.scene.getLayer('game'))

            switch (key) {
              case 'ArrowUp':
              case 'ArrowRight':
              case 'ArrowDown':
              case 'ArrowLeft':
                gameLayer.player.directions.set(
                  /**
                   * @type {import('./engine').Direction}
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
      }
    )
  }
}