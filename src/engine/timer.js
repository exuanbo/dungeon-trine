/**
 * @typedef {'RESET' | 'STOP'} TaskControlCommand
 */

export class Timer {
  /**
   * Timeout task generator.
   *
   * The passed `cb` will be called after `delay` times' `next()`.
   *
   * @private
   * @static
   *
   * @param {() => void} cb
   * @param {number} delay
   */
  static *createTimeoutTask(cb, delay) {
    for (let i = delay; i > 0; i--) {
      if (i === 0) {
        break
      }

      /** @type {TaskControlCommand} */
      const command = yield

      switch (command) {
        case 'RESET':
          i = delay + 1
          continue
        case 'STOP':
          cb = null
          return
      }
    }

    cb()
    cb = null
  }

  /**
   * Repeating task generator.
   *
   * The passed `cb` will be called every `interval + 1` times' `next()`
   *
   * @private
   * @static
   *
   * @param {() => void} cb
   * @param {number} interval
   */
  static *createIntervalTask(cb, interval) {
    for (let i = 1; i < Infinity; i++) {
      /** @type {TaskControlCommand} */
      let command

      if (i % (interval + 1) === 0) {
        command = yield cb()
      } else {
        command = yield
      }

      switch (command) {
        case 'RESET':
          i = 0
          continue
        case 'STOP':
          cb = null
          return
      }
    }
  }

  constructor() {
    /**
     * The task Map. Every iterator will be called when `update()` is called.
     *
     * @private
     *
     * @type {Map<number, Iterator<void, void, TaskControlCommand>>}
     */
    this.tasks = new Map()

    /**
     * Task unique id counter.
     *
     * Each time `setTimeout` and `setInterval` are called, the value is increased.
     *
     * @private
     */
    this.taskId = 0
  }

  /**
   * Update the timer.
   *
   * Increase `_now` by 1 and call every iterator in `tasks`.
   * Delete the iterator from `tasks` if it is done.
   *
   * @public
   */
  update() {
    if (this.tasks.size === 0) {
      return
    }

    Array.from(this.tasks.keys()).forEach(taskId => {
      if (this.tasks.get(taskId).next().done) {
        this.tasks.delete(taskId)
      }
    })
  }

  /**
   * Test if the task with the passed `taskId` is done
   * by checking wheather the task id is still in `tasks`.
   *
   * @public
   *
   * @param {number} taskId
   */
  isTaskDone(taskId) {
    return !this.tasks.has(taskId)
  }

  /**
   * Create a timeout task.
   *
   * If `cb` is omitted, an empty callback function would be called after `delay`.
   *
   * Return the task id for cancelling or reset.
   *
   * @public
   *
   * @param {(() => void) | number} cb
   * @param {number=} delay
   */
  setTimeout(cb, delay) {
    const taskId = ++this.taskId

    if (typeof cb === 'number') {
      delay = cb
      cb = () => {}
    }

    this.tasks.set(taskId, Timer.createTimeoutTask(cb, delay))
    return taskId
  }

  /**
   * Reset the counter of the timeout task with the passed `taskId`.
   *
   * Return wheather the task has been successfully reset.
   *
   * @public
   *
   * @param {number} taskId
   * @returns isReset
   */
  resetTimeout(taskId) {
    const task = this.tasks.get(taskId)

    if (task === undefined) {
      return false
    }

    task.next('RESET')
    return true
  }

  /**
   * Cancel the timeout task with the passed `taskId` and delete it from `tasks`.
   *
   * Return wheather the task has been successfully canceled.
   *
   * @public
   *
   * @param {number} taskId
   * @returns isCleared
   */
  clearTimeout(taskId) {
    const task = this.tasks.get(taskId)

    if (task === undefined) {
      return false
    }

    task.next('STOP')
    this.tasks.delete(taskId)
    return true
  }

  /**
   * Creat a repeating task.
   *
   * Return the task id for cancelling or reset.
   *
   * @public
   *
   * @param {() => void} cb
   * @param {number} interval
   */
  setInterval(cb, interval) {
    const taskId = ++this.taskId
    this.tasks.set(taskId, Timer.createIntervalTask(cb, interval))
    return taskId
  }

  /**
   * Reset the counter of the repeating task with the passed `taskId`.
   *
   * Return wheather the task has been successfully reset.
   *
   * @public
   *
   * @param {number} taskId
   * @returns isReset
   */
  resetInterval(taskId) {
    return this.resetTimeout(taskId)
  }

  /**
   * Cancel the repeating task with the passed `taskId` and delete it from `tasks`.
   *
   * Return wheather the task has been successfully canceled.
   *
   * @public
   *
   * @param {number} taskId
   * @returns isCleared
   */
  clearInterval(taskId) {
    return this.clearTimeout(taskId)
  }

  /**
   * Cancel all the `setTimeout` and `setInterval` tasks and delete them from `tasks`.
   *
   * @public
   */
  clearAll() {
    for (const task of this.tasks.values()) {
      task.next('STOP')
    }
    this.tasks.clear()
  }
}
