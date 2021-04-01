import { Map } from './map.js'
import { Player } from './charactor.js'

export class Game {
  constructor() {
    this.isMapInitialized = false

    this.map = new Map()
    this.player = new Player({ tiles: this.map.tiles })
  }

  draw() {
    if (!this.isMapInitialized) {
      this.map.draw()
      this.isMapInitialized = true
    }

    this.player.draw()
  }
}
