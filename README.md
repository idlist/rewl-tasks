# @rewl/tasks

[![npm](https://img.shields.io/npm/v/@rewl/tasks?style=flat-square)](https://www.npmjs.com/package/@rewl/tasks)
[![npm-download](https://img.shields.io/npm/dw/@rewl/tasks?style=flat-square)](https://www.npmjs.com/package/@rewl/tasks)

A simple wrapper for concurrent Promise methods, no additional functionality.

## Features

- Fully typed, tested and documented. (*probably*)
- Make your code cleaner. (*subjectively*)

If you are looking for **real** `Promise` runner and manager, please consider other packages like [Bottleneck](https://github.com/SGrondin/bottleneck).

## Wait, wha..t's this?

Although it differs subjectively from people to people, codes often get ugly when using concurrent `Promise` methods (namely `all`, `allSettled` and `race`).

For example, here we have an array to `map` to `Promise`s (let's call the array `arr` and the `async` function `doSomething`) and a single `Promise` (and call it `p`), and we want to run these `Promise`s concurrently.

Here is one of the typical piece of code without declaring a helper variable to add up those `Promise`s:

```js
await Promise.all([
  ...arr.map(async item => await doSomething(item)),
  p,
])
```

Someone may argue that using spread syntax (`...arr`) is a little bit inefficient on memory and suggest the following code:

```js
await Promise.all(arr
  .map(async item => await doSomething(item)))
  .concat([p])
)
```

...but it is (*subjectively*) **ugly**. Using an empty helper array may make it less ugly (but is still *ugly*):

```js
await Promise.all([]
  .concat(arr.map(async item => await doSomething(item)))
  .concat([p])
)
```

Also, all codes above have the same problem: we have to treat array mapping and single `Promise` differently. In one case we need to spread the array, in other cases we need to wrap the single `Promise` in an array.

now, with `@rewl/tasks`, we can have a (*subjectively*) cleaner code:

```js
import Tasks from '@rewl/tasks'

// In the place we need the concurrent Promise method:
await new Tasks()
  .add(arr.map(async item => await doSomething(item)))
  .add(p)
  .run()
```

It **does nothing more**, but it **looks prettier**, and that's what we (or at least *I*) want to achieve.

## Usage

### new Tasks()

Initialize a new task runner.

### tasks.add(p)

- `p` (`Promise | Promise[]`): `Promise` or array of `Promise`(s) to be run in concurrency.

Add a `Promise` or an array of `Promise`s to the task list.

To add many single `Promise`s to the task list, use `add()` as many times as you wish. `add()` with arbitrary number of arguments is not supported by design for prettier code.

### tasks.run()

- Returns: Array of each `Promise`'s resolve value.

Same as `Promise.all()`, run all `Promise`(s),

### tasks.settle()

- Returns: Array of each `Promise`'s state and resolve value.

Same as `Promise.allSettled()`, finish all `Promise`(s) even if any of them are rejected.

### tasks.race()

- Returns: The firstly resolved `Promise`'s resolve value.

Same as `Promise.race()`, run all `Promise`(s) and return the firstly resolved or rejected value.

You may sometimes want to narrow the type of return value maunally.

## Special thanks

This module comes from a discussion of "How to write prettier `Promise.all`" with following guys:

- [Anillc](https://github.com/Anillc) anticipated in the discussion and help give typings to this module.
- [undefined](https://github.com/undefined-moe) gave the code with spread syntax (which is also what I used in my code before).
- [YiJie](https://github.com/NWYLZW) gave the code using `concat`.
- [Shigma](https://github.com/shigma) provided brilliant TypeScript typings to this module (which itself is quite tricky as we spent nearly a whole night to find out how to give it types before he showed us the answer with ease).

## About `@rewl`

[`@rewl`](https://github.com/rewljs) ("`re`inventing the `w`hee`l`") is a personal `npm` scope of [idlist](https://github.com/idlist).

What it does is literal. I believe that there should be other existing module(s) or package(s) that has done (and most of the time do far better than) what I'm doing, but for one reason or another, I decided to reinvent the wheel again. `@rewl` is the collection of those "wheels".

## License

MIT