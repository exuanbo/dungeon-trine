import { Scene, randomInt } from '../../engine/index.js'
import { BackgroundLayer, GameLayer, HUDLayer } from './layers/index.js'
import { data } from '../../data.js'

/**
 * @typedef {{
 *    index: number
 *    monsters: {
 *      minCount: number
 *      maxCount: number
 *      eliteCount: number
 *      bossCount: number
 *    }
 * }} Level
 */

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
     * The current level.
     *
     * @public
     *
     * @type {Level}
     */
    this.level = undefined

    this.resetLevel()

    this.addLayer('background', new BackgroundLayer(/* scene */ this))
    this.addLayer('game', new GameLayer(/* scene */ this))
    this.addLayer('hud', new HUDLayer(/* scene */ this))
  }

  /**
   * Reset `level` to original.
   *
   * @public
   */
  resetLevel() {
    this.level = {
      index: 0,
      monsters: {
        minCount: 2,
        maxCount: 3,
        eliteCount: 0,
        bossCount: 0
      }
    }
  }

  /**
   * Change `level`, add monsters to `GameLayer` and heal the player.
   *
   * @public
   */
  nextLevel() {
    const gameLayer =
      /**
       * @type {import('./layers').GameLayer}
       */
      (this.getLayer('game'))

    this.level.index += 1

    const { monsters } = this.level

    if (this.level.index < 3) {
      if (this.level.index > 1) {
        monsters.minCount += 1
        monsters.maxCount += 1
      }
    } else {
      monsters.maxCount += 1

      if (monsters.eliteCount < monsters.minCount - 1) {
        monsters.eliteCount += 1
      }

      if (this.level.index >= 5) {
        monsters.bossCount = randomInt(0, 2)
      }
    }

    gameLayer.addMonsters(this.level.monsters)

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

  /**
   * Restart the game scene.
   *
   * @public
   */
  restart() {
    this.resetLevel()

    const backgroundLayer =
      /**
       * @type {import('./layers').BackgroundLayer}
       */
      (this.getLayer('background'))

    backgroundLayer.reset()

    const gameLayer =
      /**
       * @type {import('./layers').GameLayer}
       */
      (this.getLayer('game'))

    gameLayer.player.health = gameLayer.player.totalHealth = 5

    gameLayer.monsters.forEach(monster => {
      monster.destroy()
    })

    gameLayer.effects.forEach(effect => {
      effect.destroy()
    })
  }
}
