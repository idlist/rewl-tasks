import test from 'ava'
import Tasks from '../src/index'

test('Initialize task runner', t => {
  const tasks = new Tasks()

  t.deepEqual(tasks.list, [])
})

test('Add single promise', t => {
  const p1 = Promise.resolve(1)
  const tasks = new Tasks().add(p1)

  t.deepEqual(tasks.list, [p1])
})

test('Add an array of promises', t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.resolve('a')
  const p3 = Promise.resolve(true)
  const tasks = new Tasks().add([p1, p2, p3])

  t.deepEqual(tasks.list, [p1, p2, p3])
})

test('Add both single promise and an array of promises', t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.resolve('a')
  const p3 = Promise.resolve(true)
  const tasks = new Tasks().add(p1).add([p2, p3])

  t.deepEqual(tasks.list, [p1, p2, p3])
})

test('Run tasks.run() with all resolved Promises', async t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.resolve('a')
  const p3 = Promise.resolve(true)
  const r = await new Tasks().add([p1, p2, p3]).run()

  t.deepEqual(r, [1, 'a', true])
})

test('Run tasks.run() with 1 rejected Promise', async t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.reject(new Error('Reject'))

  const error = await t.throwsAsync<Error>(async () => {
    await new Tasks().add([p1, p2]).run()
  }, { instanceOf: Error })
  t.is(error.message, 'Reject')
})

test('Run tasks.settle() with all resolved Promises', async t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.resolve('a')
  const p3 = Promise.resolve(true)
  const r = await new Tasks().add([p1, p2, p3]).settle()
  const e: PromiseSettledResult<unknown>[] = [
    { status: 'fulfilled', value: 1 },
    { status: 'fulfilled', value: 'a' },
    { status: 'fulfilled', value: true },
  ]

  t.deepEqual(r, e)
})

test('Run tasks.settle() with 1 rejected Promise', async t => {
  const p1 = Promise.resolve(1)
  const p2 = Promise.reject(new Error('Reject'))
  const r = await new Tasks().add([p1, p2]).settle()
  const e: PromiseSettledResult<unknown>[] = [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: new Error('Reject') },
  ]

  t.deepEqual(r, e)
})

test('Run tasks.race() with all resolved Promises', async t => {
  const p1 = Promise.resolve(1)
  const p2 = new Promise(resolve => { setTimeout(() => resolve('a'), 1) })
  const r = await new Tasks().add([p1, p2]).race()

  t.is(r, 1)
})

test('Run tasks.race() with firstly rejected Promise', async t => {
  const p1 = Promise.reject(new Error('Reject'))
  const p2 = new Promise(resolve => { setTimeout(() => resolve('a'), 1) })

  const error = await t.throwsAsync(async () => {
    await new Tasks().add([p1, p2]).race()
  }, { instanceOf: Error })
  t.is(error.message, 'Reject')
})

test('Run tasks.race() with laterly rejected Promise', async t => {
  const p1 = Promise.resolve(1)
  const p2 = new Promise((_, reject) => { setTimeout(() => reject(new Error('reject')), 1) })

  const r = await new Tasks().add([p1, p2]).race()
  t.is(r, 1)
})