import { Scene, randomInt } from '../../engine/index.js'
import { BackgroundLayer, GameLayer, HUDLayer } from './layers/index.js'

import { data } from '../../data.js'

export class GameScene extends Scene {
  /**
   * @param {import('../../game').Game} game
   */
  constructor(game) {
    const { width, height } = data.config

    super(game, /* sceneConfig */ { name: 'game', width, height })

    /**
     * The current score of the game.
     *
     * @public
     */
    this.score = 0

    /**
     * The current level configuration.
     *
     * @public
     */
    this.levelConfig = {
      number: 0,
      monsters: {
        minCount: 2,
        maxCount: 3,
        eliteCount: 0,
        bossCount: 0
      }
    }

    this.addLayer('background', new BackgroundLayer(/* scene */ this))
    this.addLayer('game', new GameLayer(/* scene */ this))
    this.addLayer('hud', new HUDLayer(/* scene */ this))
  }

  /**
   * Change `levelConfig`, add monsters to `GameLayer` and heal the player.
   *
   * @public
   */
  nextLevel() {
    const gameLayer =
      /**
       * @type {import('./layers').GameLayer}
       */
      (this.getLayer('game'))

    this.levelConfig.number += 1

    const { monsters } = this.levelConfig

    if (this.levelConfig.number < 3) {
      if (this.levelConfig.number > 1) {
        monsters.minCount += 1
        monsters.maxCount += 1
      }
    } else {
      monsters.maxCount += 1

      if (monsters.eliteCount < monsters.minCount - 1) {
        monsters.eliteCount += 1
      }

      if (this.levelConfig.number >= 5) {
        monsters.bossCount = randomInt(0, 2)
      }
    }

    gameLayer.addMonsters(this.levelConfig.monsters)

    const { player } = gameLayer

    player.health += 2
    if (player.health > player.totalHealth) {
      player.totalHealth = randomInt(player.totalHealth, player.health + 1)

      if (player.totalHealth > 10) {
        player.totalHealth = 10
      }
      player.health = player.totalHealth
    }
  }
}
