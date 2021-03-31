import Game from './game.js'
import View from './view.js'
import Controller from './controller.js'

const init = () => {
  const controller = new Controller(new Game(), new View())
  controller.init()
}

window.addEventListener('DOMContentLoaded', init, false)
