const ARROW_KEY_CODES = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']

class Controller {
  constructor(game, view) {
    this.keyboard = new Map()

    this.game = game
    this.view = view
  }

  init() {
    this.view.draw(this.game)

    window.addEventListener('keydown', e => this.handleKey(e), false)
    window.addEventListener('keyup', e => this.handleKey(e), false)
  }

  handleKey(e) {
    const isKeydown = e.type === 'keydown'
    this.keyboard.set(e.code, isKeydown)

    for (const [k, v] of this.keyboard) {
      if (ARROW_KEY_CODES.includes(k)) {
        const direction = k.slice(5).toLowerCase()
        this.game.player.directions[direction] = v
      }
    }

    if (!isKeydown) {
      for (const v of this.keyboard.values()) {
        if (v) {
          return
        }
      }

      this.game.player.stopAction()
    }
  }
}

export default Controller
