import { AssetLoader } from './assetLoader.js'
import { Game } from './game.js'
import { View } from './view.js'

const ARROW_KEY_CODES = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']

export class Controller {
  constructor() {
    this.assetLoader = new AssetLoader()
    this.keyboardMap = new Map()
  }

  async init() {
    await this.assetLoader.load()

    this.game = new Game()
    this.view = new View()
    this.view.draw(this.game)

    window.addEventListener('keydown', e => this.handleKey(e), false)
    window.addEventListener('keyup', e => this.handleKey(e), false)
  }

  handleKey(e) {
    const isKeydown = e.type === 'keydown'
    this.keyboardMap.set(e.code, isKeydown)

    for (const [k, v] of this.keyboardMap) {
      if (ARROW_KEY_CODES.includes(k)) {
        const direction = k.slice(5).toLowerCase()
        this.game.player.directions[direction] = v
      }
    }

    if (!isKeydown) {
      for (const v of this.keyboardMap.values()) {
        if (v) {
          return
        }
      }

      this.game.player.stopAction()
    }
  }
}
