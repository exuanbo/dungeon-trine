export class Game {
  /**
   * @param {import('./scene').Scene} initialScene
   * @param {{ containerSelector?: string }=} gameConfig
   */
  constructor(initialScene, { containerSelector = '#game' } = {}) {
    /**
     * The scenes of the game.
     *
     * @private
     *
     * @type {Map<string, import('./scene').Scene>}
     */
    this.scenes = new Map()

    this.addScene(/* scene */ initialScene)

    /**
     * The current scene of the game.
     *
     * @public
     */
    this.scene = initialScene

    /**
     * CSS selector of the container DOM element. Default to `'#game'`.
     *
     * @public
     */
    this.containerSelector = containerSelector
  }

  /**
   * Add a new scene to the game.
   * Throw an error if the passed scene name already exists.
   *
   * @public
   *
   * @param {import('./scene').Scene} scene
   */
  addScene(scene) {
    if (this.scenes.has(scene.name)) {
      throw new Error(`Scene '${scene.name}' already exists.`)
    }

    scene.game = this
    this.scenes.set(scene.name, scene)
  }

  /**
   * Change the current scene of the game.
   * Throw an error if the passed scene name does not exist.
   *
   * @public
   *
   * @param {string} sceneName
   */
  changeScene(sceneName) {
    if (!this.scenes.has(sceneName)) {
      throw new Error(`Scene '${sceneName}' does not exist.`)
    }

    this.scene = this.scenes.get(sceneName)
  }

  /**
   * Throw an error if `scene` is `undefined` or `null`.
   *
   * @private
   *
   * @returns {void | never}
   */
  checkScene() {
    if (this.scene === undefined) {
      throw new Error('There must be at least one scene.')
    }
  }

  /**
   * Update the current scene.
   *
   * @public
   */
  update() {
    this.checkScene()

    this.scene.update()
  }

  /**
   * Render the current scene.
   *
   * @public
   */
  render() {
    this.checkScene()

    this.scene.render()
  }

  /**
   * Call `destroy` on each `scene` and delete the references to the scenes.
   *
   * @public
   */
  destroy() {
    for (const scene of this.scenes.values()) {
      scene.destroy()
    }
    this.scenes.clear()
    this.scene = null
  }
}
