type AllAwaited<O> = { [K in keyof O]: Awaited<O[K]> }

type AllSettled<O> = { [K in keyof O]: PromiseSettledResult<O[K]> }

/**
 * Simple wrapper for concurrent `Promise` methods to make the code prettier.
 */
class Tasks<T extends unknown[] = []> {
  list: Promise<unknown>[] = []

  /**
   * Add a `Promise` or an array of `Promise`s to the task list.
   *
   * To add many single `Promise`s to the task list, use `add()` as many times
   * as you wish. `add()` with arbitrary number of arguments is not supported
   * by design for the sake of code style.
   *
   * @param p `Promise` to be run in concurrency.
   */
  add<V>(p: Promise<V>): Tasks<[...T, V]>
  /**
   * Add a `Promise` or an array of `Promise`s to the task list.
   *
   * @param p Array of `Promise`s to be run in concurrency.
   */
  add<A extends readonly unknown[] | []>(p: A): Tasks<[...T, ...AllAwaited<A>]>
  add(p: Promise<unknown> | Promise<unknown>[]) {
    this.list = this.list.concat(Array.isArray(p) ? p : [p])
    return this as unknown
  }

  /**
   * Same as `Promise.all()`, run all `Promise`(s),
   *
   * @returns Array of each `Promise`'s resolve value.
   */
  run() {
    return Promise.all(this.list) as Promise<T>
  }

  /**
   * Same as `Promise.allSettled()`, run all `Promise`(s) even if one of them rejected.
   *
   * @returns Array of each `Promise`'s state and resolve value.
   */
  settle() {
    return Promise.allSettled(this.list) as Promise<AllSettled<T>>
  }

  /**
   * Same as `Promise.race()`, run all `Promise`(s) and return the firstly resolved value.
   * You may sometimes want to narrow the return value maunally.
   *
   * @returns The firstly resolved `Promise`'s resolve value.
   */
  race() {
    return Promise.race(this.list) as Promise<T[number]>
  }
}

export = Tasks