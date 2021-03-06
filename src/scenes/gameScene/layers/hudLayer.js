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

    const spriteSheet = data.assets.images['0x72_DungeonTilesetII_v1.3']

    /**
     * @private
     */
    this.heartSprites = new Map([
      ['full', new Sprite(spriteSheet, 1152, 1024, 64, 64)],
      ['half', new Sprite(spriteSheet, 1216, 1024, 64, 64)],
      ['empty', new Sprite(spriteSheet, 1280, 1024, 64, 64)]
    ])

    /**
     * The score of the game. From `GameScene.score`.
     *
     * @private
     *
     * @type {number}
     */
    this.score = undefined

    this.setScore()

    /**
     * The level number.
     *
     * @private
     *
     * @type {number}
     */
    this.levelIndex = undefined

    this.setLevelIndex()

    /**
     * If the needed font is loaded.
     *
     * @private
     */
    this.isFontLoaded = false
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

    if (player.health !== this.health) {
      if (player.totalHealth !== this.totalHealth) {
        this.totalHealth = player.totalHealth
      }
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
    if (this.scene.score !== this.score) {
      this.score = this.scene.score

      this.isDirty = true
    }
  }

  /**
   * Set `levelIndex` from `GameScene.level`.
   *
   * @private
   */
  setLevelIndex() {
    if (this.scene.level.index !== this.levelIndex) {
      this.levelIndex = this.scene.level.index

      this.isDirty = true
    }
  }

  /**
   * Check if the needed font is loaded.
   *
   * @private
   */
  checkFontLoaded() {
    // @ts-ignore
    if (document.fonts.check('300 64px m5x7')) {
      this.isFontLoaded = true
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
    this.setLevelIndex()

    if (!this.isFontLoaded) {
      this.checkFontLoaded()
    }
  }

  /**
   * Render the hearts representing player's `health`.
   *
   * @private
   */
  renderHearts() {
    let heartFullCount = Math.floor(this.health)
    let heartHalfCount = (this.health / 0.5) % 2 === 0 ? 0 : 1
    let heartEmptyCount = this.totalHealth - heartFullCount - heartHalfCount

    const dy = 62

    for (let heartIndex = 0; heartIndex < this.totalHealth; heartIndex++) {
      /**
       * @type {'full' | 'half' | 'empty'}
       */
      let heartType

      const dx = 66 + heartIndex * 64

      if (heartFullCount > 0) {
        heartType = 'full'
        heartFullCount--
      } else if (heartHalfCount > 0) {
        heartType = 'half'
        heartHalfCount--
      } else if (heartEmptyCount > 0) {
        heartType = 'empty'
        heartEmptyCount--
      }

      this.heartSprites.get(heartType).render(/* ctx */ this.ctx, dx, dy)
    }
  }

  /**
   * Render the game score.
   *
   * @private
   */
  renderScoreAndLevelIndex() {
    this.ctx.font = '300 64px m5x7'

    const text = `SCORE: ${this.score}  LEVEL: ${this.levelIndex}`

    const x = 66 + this.totalHealth * 64 + 24
    const y = 110

    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 8
    this.ctx.strokeText(text, x, y)

    this.ctx.fillStyle = '#FDF7ED'
    this.ctx.fillText(text, x, y)
  }

  /**
   * Render the HUD to the layer canvas.
   *
   * @override
   * @public
   */
  render() {
    if (!this.isDirty || !this.isFontLoaded) {
      return
    }

    const { width, height } = data.config

    this.ctx.clearRect(0, 0, width, height)

    this.renderHearts()
    this.renderScoreAndLevelIndex()

    this.isDirty = false
  }
}
