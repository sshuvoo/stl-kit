# Queue

This document explains what a Queue is, why and when you would use one,
how the `Queue` in this repository is implemented, and how to use its
public API. It includes detailed examples, edge cases to watch for, and
an API reference table for quick lookup. The goal is to be clear for
beginners while also useful for experienced developers.

---

## 1) What is a Queue?

A queue is a simple data structure that follows FIFO (First-In, First-Out).
Items are added to the back (tail) and removed from the front (head). It is
useful when order matters and you want the earliest inserted item to be
processed first.

Real-life examples:

- A line at a ticket counter—first person in line is the first served.
- Task scheduling where jobs are processed in arrival order.
- Breadth-first traversal of graphs.

Why use a Queue?

- You need predictable, ordered processing of tasks or events.
- You want simple push/pop semantics with O(1) operations for adding and
  removing at the ends.

When not to use it:

- If you need random access by index or frequent mid-list insertion by
  position, prefer an array or `Vector`.

---

## 2) How this `Queue` is implemented

File: `src/structures/queue.ts`

Key implementation details:

- The `Queue` is backed by a doubly-linked list using `ListNode` nodes.
  This gives O(1) push/pop at the ends and stable node references.
- The class keeps private `#head`, `#tail`, and `#length` fields.
- There is optional `factory` support used by `emplace(...)` to construct
  elements in-place.
- The implementation throws clear errors for invalid usage (for example
  attempting to `pop()` or `peek()` on an empty queue — see special note
  below for why we have both `front` and `peek`).

Complexity summary:

- `push`, `pop`, `peek` (when defined) — O(1)
- `toArray`, `forEach`, `clear`, `clone` — O(n)
- `assign` — O(n)

---

## 3) Design choices and special notes

Two small API design decisions were made intentionally and are important
for users to understand:

1. `front` getter vs `peek()` method

- `front` is a JS-friendly getter that returns the value at the head, or
  `undefined` when the queue is empty. This is convenient when you prefer
  JavaScript idioms and want a non-throwing inspection.
- `peek()` is a method that intentionally throws an `Error` when the queue
  is empty. This follows an STL-like, explicit-failure pattern: calling
  `peek()` on empty queues is likely a bug, so the method fails loudly.

Why both?

- We keep both to support two mental models:
  - JavaScript developers often expect property accessors to return
    `undefined` when absent and to avoid exceptions.
  - Developers familiar with STL (C++) expect `peek()`/`top()` to throw
    or be undefined behaviour on empty containers; explicit errors help
    catch bugs earlier.

Choose the one that fits your code style. If you want a safe check use
`front` or `isEmpty()` before `peek()`.

2. `size()` method vs `length` getter

- `size()` mirrors STL naming and may be preferred by developers coming
  from languages that use `size()` (C++, Java).
- `length` is the JavaScript-friendly property so array-minded developers
  can use a familiar name.

Both return the same number and are kept for ergonomics only.

---

## 4) Public API — detailed explanations with examples

Each public method and important behaviour is explained with complexity,
edge cases, and examples.

### Constructor

Signature:

- `new Queue<T, A extends unknown[] = unknown[]>({ initValues?, factory? } = {})`

What it does:

- Create a new `Queue`. Optionally initialize with `initValues` (an
  array) which will be pushed to the queue in order. Optionally provide a
  `factory` used by `emplace(...args)`.

Complexity: O(n) when `initValues` is provided (push each element), O(1)
otherwise.

Edge cases:

- Passing `initValues` that is not an array throws `TypeError`.

Example:

```ts
import { Queue } from 'stl-kit'

const q = new Queue<number>()
const q2 = new Queue({ initValues: [1, 2, 3] })

class Point {
  constructor(public x: number, public y: number) {}
}
const qf = new Queue<Point, [number, number]>({
  factory: (a, b) => new Point(a, b),
})
// For better type inference (Recommended)
const qf = new Queue({
  factory: (a: number, b: number) => new Point(a, b),
})
qf.emplace(2, 3) // pushed Point { x: 2, y: 3 }
```

---

### Iteration and reversed

- `for (const v of queue)` iterates from front (head) to back (tail).
- `queue.reversed` is a getter that returns an iterator yielding values
  from tail to head.

Example:

```ts
for (const v of q2) {
  console.log(v)
}
console.log([...q2.reversed])
```

---

### push(value)

What it does:

- Add `value` to the back (tail) of the queue.

Complexity: O(1)

Example:

```ts
q.push('a')
q.push('b')
```

---

### pop()

What it does:

- Remove and return the value at the front (head) of the queue.

Complexity: O(1)

Edge cases:

- `pop()` throws an `Error` when the queue is empty. This makes invalid
  pops explicit and prevents silent bugs.

Example:

```ts
const x = q.pop()
```

---

### emplace(...args)

What it does:

- Construct a new element using the `factory` provided at construction and
  push it into the queue.

Complexity: O(1) plus factory cost.

Edge cases:

- Throws `TypeError` if no `factory` was provided.

Example:

```ts
interface Area {
  width: number
  height: number
  area: number
}
const f = new Queue<Area, [number, number]>({
  factory: (width, height) => {
    return { width, height, area: width * height }
  }
})
// For better type inference (Recommended)
const f = new Queue({
  factory: (width: number, height: number) => {
    return { width, height, area: width * height } as Area
  }
})
f.emplace(5, 10) // pushes { width: 5, height: 10, area: 50 }
```

---

### peek()

What it does:

- Return the value at the front without removing it.

Complexity: O(1)

Edge cases:

- Throws an `Error` when the queue is empty. Prefer `front` if you want
  a non-throwing inspection.

Example:

```ts
if (!q.isEmpty()) {
  console.log(q.peek())
}
```

---

### front getter

What it does:

- Return the value at the front or `undefined` when the queue is empty.

Complexity: O(1)

Example:

```ts
console.log(q.front) // may be undefined when empty
```

---

### isEmpty(), size(), length, clear(), toArray()

- `isEmpty()` — true if the queue has no elements.
- `size()` — returns the number of elements (STL-style).
- `length` — getter alias for `size()` (JS-style).
- `clear()` — remove all elements (O(n) to cleanup nodes).
- `toArray()` — return a shallow array copy of the queue (front -> back).

Example:

```ts
console.log(q.size(), q.length, q.isEmpty())
q.clear()
console.log(q.toArray())
```

---

### toArray() and iteration notes

- `toArray()` and iteration return values in queue order (front -> back).
- These are shallow copies; mutating returned objects affects stored
  elements if they are reference types.

---

### assign(values|count, ...)

Overloads:

- `assign(values: T[], start?: number, end?: number)` — copy slice of an
  array into the queue
- `assign(count: number, value: T)` — fill the queue with `count` copies
  of `value`

Both clear the queue first.

Example:

```ts
q.assign([1, 2, 3])
q.assign(3, 'x')
```

---

### forEach(callback, thisArg?)

What it does:

- Call `callback(value, index, queue)` for each element. If `callback`
  returns `false`, iteration stops early.

Edge cases:

- Throws `TypeError` when `callback` is not a function.

Example:

```ts
q.forEach((v) => console.log(v))
```

---

### clone(deepCloneFn?)

What it does:

- Return a shallow copy of the queue. By default it uses `structuredClone`
  if available; otherwise a custom `deepCloneFn` must be provided.

Complexity: O(n)

Example:

```ts
const copy = q.clone()
```

---

### Static helpers: equals(queue1, queue2), swap(queue1, queue2)

- `equals` compares two queues element-by-element using a comparator
  function (defaults to `===`). Throws if inputs are not `Queue` instances.
- `swap` exchanges internal pointers and lengths in O(1) — useful for
  efficient swaps without copying.

Example:

```ts
Queue.equals(q, other)
Queue.swap(q, other)
```

---

## 5) Examples and patterns

### Basic FIFO usage

```ts
const q = new Queue<number>()
q.push(1)
q.push(2)
console.log(q.pop()) // 1
console.log(q.pop()) // 2
```

### `front` vs `peek` pattern

```ts
const q = new Queue<number>()
if (q.front !== undefined) {
  // safe, non-throwing access
  console.log(q.front)
}

// or, if you prefer explicit errors:
try {
  console.log(q.peek())
} catch (err) {
  console.error('empty queue')
}
```

### Using `clone` for safe mutable operations

If you want to examine or sort queue contents without mutating the
original, clone and operate on the copy:

```ts
const copy = q.clone()
const items = copy.toArray()
```

---

## 6) Edge cases and best practices

- Use `isEmpty()` before `pop()` or `peek()` if you want to avoid exceptions.
- Use `front` when you prefer a non-throwing, idiomatic JS accessor.
- Use `size()` or `length` interchangeably — both return the same value.
- When constructing queues from large arrays, prefer `assign(values)` or
  the `initValues` constructor option to avoid repeated reallocation costs.
- `clear()` frees nodes via their `cleanup()` helper; ensure that cleanup
  side effects (if any) are acceptable.

---

## 7) API Reference Table (quick sight)

| Name        | Signature                            | Description                                   | Complexity                |
| ----------- | ------------------------------------ | --------------------------------------------- | ------------------------- |
| Constructor | `new Queue(options?)`                | Create queue; accepts `initValues`, `factory` | O(n) w/ init              |
| push        | `push(value: T)`                     | Insert at tail                                | O(1)                      |
| pop         | `pop(): T`                           | Remove and return head (throws if empty)      | O(1)                      |
| emplace     | `emplace(...args: A)`                | Build using factory and push                  | O(1)+cost                 |
| peek        | `peek(): T`                          | Inspect head (throws if empty)                | O(1)                      |
| front       | `get front(): T \| undefined`        | Inspect head non-throwing                     | O(1)                      |
| isEmpty     | `isEmpty(): boolean`                 | True when empty                               | O(1)                      |
| clear       | `clear(): void`                      | Remove all elements                           | O(n)                      |
| toArray     | `toArray(): T[]`                     | Array copy (front -> back)                    | O(n)                      |
| assign      | `assign(...args)`                    | Replace contents                              | O(n)                      |
| forEach     | `forEach(callback)`                  | Iterate with early-stop support               | O(n)                      |
| clone       | `clone(deepCloneFn?)`                | Create deep/shallow copy                      | O(n)                      |
| size        | `size(): number`                     | Number of elements                            | O(1)                      |
| length      | `get length(): number`               | Alias for `size()`                            | O(1)                      |
| reversed    | `get reversed(): IterableIterator`   | Reverse iterator (tail -> head)               | O(n)                      |
| equals      | `static equals(q1, q2, comparator?)` | Compare two queues                            | O(n)                      |
| swap        | `static swap(q1, q2)`                | O(1) swap internal pointers                   | O(1)                      |

---

## 8) Notes, limitations and contribution request

- This `Queue` focuses on clear semantics and beginner-friendly behaviour.
- We intentionally expose both non-throwing (`front`) and throwing
  (`peek`) accessors for ergonomic and defensive styles, respectively.
- If you discover a bug or have ideas for additional helpers, please open an issue or submit a
  pull request with tests and examples.

Thank you for reading — contributions and questions are welcome!

---

_Created from code in `src/structures/queue.ts`. If you update the
implementation, consider updating this documentation accordingly._
