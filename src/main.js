import { Game } from './game.js'
import { View } from './view.js'
import { Controller } from './controller.js'

new Controller(new Game(), new View()).init()
