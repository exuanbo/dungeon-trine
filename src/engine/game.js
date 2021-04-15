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
     */
    this.scenes = new Map([[initialScene.name, initialScene]])

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
   * @param {string} sceneName
   * @param {import('./scene').Scene} scene
   */
  addScene(sceneName, scene) {
    if (this.scenes.has(sceneName)) {
      throw new Error(`Scene '${sceneName}' already exists.`)
    }

    this.scenes.set(sceneName, scene)
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
   * Update the current scene.
   *
   * @public
   */
  update() {
    this.scene.update()
  }

  /**
   * Render the current scene.
   *
   * @public
   */
  render() {
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
