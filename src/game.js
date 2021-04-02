import { Map } from './map.js'
import { Player } from './charactor.js'

export class Game {
  constructor() {
    this.isMapInitialized = false

    this.map = new Map()
    this.player = new Player({ tiles: this.map.tiles })
  }

  render() {
    if (!this.isMapInitialized) {
      this.map.render()
      this.isMapInitialized = true
    }

    this.player.render()
  }
}
