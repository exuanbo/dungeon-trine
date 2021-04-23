import { Sprite, Layer } from '../../../engine/index.js'
import { data } from '../../../data.js'

/**
 * @extends {Layer<import('..').GameScene>}
 */
export class HUDLayer extends Layer {
  /**
   * @param {import('..').GameScene} scene
   */
  constructor(scene) {
    super(scene, /* layerConfig */ { zIndex: 2 })

    /**
     * The total health of the player.
     *
     * @private
     *
     * @type {number}
     */
    this.totalHealth = undefined

    /**
     * The current health of the player.
     *
     * @private
     *
     * @type {number}
     */
    this.health = undefined

    this.setPlayerHealth()

    /**
     * The score of the game. From `GameScene.score`.
     *
     * @private
     */
    this.score = this.scene.score

    const spriteSheet = data.assets.images['0x72_DungeonTilesetII_v1.3']

    /**
     * @private
     */
    this.sprites = new Map([
      ['heartFull', new Sprite(spriteSheet, 1152, 1024, 64, 64)],
      ['heartHalf', new Sprite(spriteSheet, 1216, 1024, 64, 64)],
      ['heartEmpty', new Sprite(spriteSheet, 1280, 1024, 64, 64)]
    ])
  }

  /**
   * Set `totalHealth` and `health` from `GameLayer.player`.
   *
   * @private
   */
  setPlayerHealth() {
    const { player } =
      /**
       * @type {import('./gameLayer').GameLayer}
       */
      (this.scene.getLayer('game'))

    if (
      this.health !== player.health ||
      this.totalHealth !== player.totalHealth
    ) {
      this.totalHealth = player.totalHealth
      this.health = player.health > 0 ? player.health : 0

      this.isDirty = true
    }
  }

  /**
   * Set `score` from `GameScene.score`.
   *
   * @private
   */
  setScore() {
    const newScore = this.scene.score

    if (newScore !== this.score) {
      this.score = newScore

      this.isDirty = true
    }
  }

  /**
   * Update the HUD layer.
   *
   * @override
   * @public
   */
  update() {
    this.setPlayerHealth()
    this.setScore()
  }

  /**
   * Render the HUD to the layer canvas.
   *
   * @override
   * @public
   */
  render() {
    if (!this.isDirty) {
      return
    }

    const { width, height } = data.config

    this.ctx.clearRect(0, 0, width, height)

    let heartFullCount = Math.floor(this.health)
    let heartHalfCount = (this.health / 0.5) % 2 === 0 ? 0 : 1
    let heartEmptyCount = this.totalHealth - heartFullCount - heartHalfCount

    const dy = 62

    for (let heartIndex = 0; heartIndex < 5; heartIndex++) {
      /**
       * @type {'heartFull' | 'heartHalf' | 'heartEmpty'}
       */
      let heartType

      const dx = 66 + heartIndex * 64

      if (heartFullCount > 0) {
        heartType = 'heartFull'
        heartFullCount--
      } else if (heartHalfCount > 0) {
        heartType = 'heartHalf'
        heartHalfCount--
      } else if (heartEmptyCount > 0) {
        heartType = 'heartEmpty'
        heartEmptyCount--
      }

      this.sprites.get(heartType).render(/* ctx */ this.ctx, dx, dy)
    }

    this.ctx.font = '300 64px m5x7'

    const text = `SCORE: ${this.scene.score}`

    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 8
    this.ctx.strokeText(text, 406, 106)

    this.ctx.fillStyle = '#FDF7ED'
    this.ctx.fillText(text, 406, 106)

    this.isDirty = false
  }
}