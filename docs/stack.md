# Stack

This document explains what a Stack is, why and when you would use one,
how the `Stack` in this repository is implemented, and how to use its
public API. It includes detailed examples, edge cases to watch for, and
an API reference table for quick lookup. The goal is to be clear for
beginners while also useful for experienced developers.

---

## 1) What is a Stack?

A stack is a simple data structure that follows LIFO (Last-In, First-Out).
Items are pushed onto the top and popped from the top. The most recently
pushed item is the first to be removed.

Real-life examples:

- A stack of plates—add to the top, remove from the top.
- Call stack in programming languages (last called function returns first).
- Undo stacks in editors (most recent change undone first).

Why use a Stack?

- You need LIFO semantics for algorithms (DFS, expression evaluation,
  backtracking).
- You want O(1) push/pop operations and simple, predictable behaviour.

When not to use it:

- If you need FIFO behaviour, prefer `Queue` or `Deque`.
- If you need random access by index, prefer `Vector` or array.

---

## 2) How this `Stack` is implemented

File: `src/structures/stack.ts`

Key implementation details:

- The `Stack` is backed by a doubly-linked list using `ListNode` nodes.
  This gives O(1) push/pop at the top and stable node references.
- The class keeps private `#head`, `#tail`, and `#length` fields.
- There is optional `factory` support used by `emplace(...)` to construct
  elements in-place.
- The implementation provides both non-throwing and throwing accessors
  (`top` vs `peek()`) to support different developer ergonomics.

Complexity summary:

- `push`, `pop`, `peek` — O(1)
- `toArray`, `forEach`, `clear`, `clone` — O(n)
- `assign` — O(n)

---

## 3) Design choices and special notes

Two small API design decisions were made intentionally and are important
for users to understand:

1. `top` getter vs `peek()` method

- `top` is a JS-friendly getter that returns the value at the top, or
  `undefined` when the stack is empty. Use this when you prefer a
  non-throwing inspection.
- `peek()` is a method that intentionally throws an `Error` when the
  stack is empty. This follows a defensive, explicit-failure pattern: if
  calling `peek()` on an empty stack is likely a bug, failing loudly
  helps catch it.

Why both?

- JavaScript developers often expect property accessors to return
  `undefined` when absent and to avoid exceptions.
- Developers familiar with STL or defensive coding prefer explicit
  errors to reveal bugs early.

Choose the one that fits your code style. If you want a safe check use
`top` or `isEmpty()` before `peek()`.

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

- `new Stack<T, A extends unknown[] = unknown[]>({ initValues?, factory? } = {})`

What it does:

- Create a new `Stack`. Optionally initialize with `initValues` (an
  array) which will be pushed in order (first element becomes bottom).
  Optionally provide a `factory` used by `emplace(...args)`.

Complexity: O(n) when `initValues` is provided (push each element), O(1)
otherwise.

Edge cases:

- Passing `initValues` that is not an array throws `TypeError`.

Example:

```ts
import { Stack } from 'stl-kit'

const s1 = new Stack<number>()
const s2 = new Stack({ initValues: [1, 2, 3] })

// Factory example
class Rect {
  constructor(
    public w: number,
    public h: number,
  ) {}
}
type FactoryArgs = [w: number, h: number]
const s3 = new Stack<Rect, FactoryArgs>({
  factory: (w, h) => new Rect(w, h),
})
s3.emplace(2, 4) // pushes Rect { w: 2, h: 4 }
```

---

### Iteration and reversed

- `for (const v of stack)` iterates from bottom (head) to top (tail).
- `stack.reversed` is a getter that returns an iterator yielding values
  from top to bottom.

Example:

```ts
const s = new Stack({ initValues: [1, 2, 3] })
for (const v of s) console.log(v) // 1 -> 2 -> 3
for (const v of s.reversed) console.log(v) // 3 -> 2 -> 1
```

---

### push(value)

What it does:

- Push `value` onto the top of the stack.

Complexity: O(1)

Example:

```ts
const s = new Stack<number>()
s.push(1)
s.push(2)
```

---

### pop()

What it does:

- Remove and return the top value from the stack.

Complexity: O(1)

Edge cases:

- `pop()` throws an `Error` when the stack is empty. This avoids silent
  bugs from invalid pops.

Example:

```ts
const s = new Stack({ initValues: ['a', 'b'] })
console.log(s.pop()) // 'b'
console.log(s.pop()) // 'a'
console.log(s.pop()) // Error: Cannot perform pop operation on empty stack.
```

---

### emplace(...args)

What it does:

- Construct a new element using the `factory` provided at construction and
  push it onto the stack.

Complexity: O(1) plus factory cost.

Edge cases:

- Throws `TypeError` if no `factory` was provided.

Example:

```ts
type P = { x: number }
const s = new Stack({ factory: (n: number) => ({ x: n }) as P })
s.emplace(10) // pushes { x: 10 }
```

---

### peek()

What it does:

- Return the top value without removing it.

Complexity: O(1)

Edge cases:

- Throws an `Error` when the stack is empty. Prefer `top` if you want a
  non-throwing inspection.

Example:

```ts
const s = new Stack({ initValues: [5] })
console.log(s.peek()) // 5
```

---

### top getter

What it does:

- Return the top value or `undefined` when the stack is empty.

Complexity: O(1)

Example:

```ts
const s = new Stack<number>()
console.log(s.top) // undefined
s.push(42)
console.log(s.top) // 42
```

---

### isEmpty(), size(), length, clear(), toArray()

- `isEmpty()` — true if the stack has no elements.
- `size()` — returns the number of elements (STL-style).
- `length` — getter alias for `size()` (JS-style).
- `clear()` — remove all elements (O(n) to cleanup nodes).
- `toArray()` — return a shallow array copy of the stack (bottom -> top).

Example:

```ts
const s = new Stack({ initValues: [1, 2, 3] })
console.log(s.size()) // 3
console.log(s.length) // 3
console.log(s.isEmpty()) // false
console.log(s.toArray()) // [1, 2, 3]
s.clear()
console.log([...s]) // []
```

---

### assign(values|count, ...)

Overloads:

- `assign(values: T[], start?: number, end?: number)` — copy slice of an
  array into the stack
- `assign(count: number, value: T)` — fill the stack with `count` copies
  of `value`

Both clear the stack first.

Example:

```ts
const s = new Stack<number>()
s.assign([1, 2, 3, 4])
s.assign(2, 99) // [99, 99]
```

---

### forEach(callback, thisArg?)

What it does:

- Call `callback(value, index, stack)` for each element. If `callback`
  returns `false`, iteration stops early.

Edge cases:

- Throws `TypeError` when `callback` is not a function.

Example:

```ts
const s = new Stack({ initValues: ['a', 'b', 'c'] })
s.forEach((v) => console.log(v)) // iterates from bottom to top
```

---

### clone(deepCloneFn?)

What it does:

- Return a shallow copy of the stack. By default it uses `structuredClone`
  if available; otherwise a custom `deepCloneFn` must be provided.

Complexity: O(n)

Example:

```ts
const copy = s.clone()
// or with custom deep clone
const copy2 = s.clone((v) => ({ ...v }))
```

---

### Static helpers: equals(stack1, stack2), swap(stack1, stack2)

- `equals` compares two stacks element-by-element using a comparator
  function (defaults to `===`). Throws if inputs are not `Stack` instances.
- `swap` exchanges internal pointers and lengths in O(1) — useful for
  efficient swaps without copying.

Example:

```ts
const a = new Stack({ initValues: [1, 2, 3] })
const b = new Stack({ initValues: [4, 5, 6] })
Stack.equals(a, b) // false
Stack.swap(a, b) // a = [4,5,6], b = [1,2,3]
```

---

## 5) Examples and patterns

### Basic LIFO usage

```ts
const s = new Stack<number>({ initValues: [1, 2, 3] })
console.log(s.pop()) // 3
console.log(s.pop()) // 2
console.log(s.pop()) // 1
```

### `top` vs `peek` pattern

```ts
const s = new Stack<number>()
console.log(s.top) // undefined (safe, non-throwing)
try {
  console.log(s.peek())
} catch (err) {
  // peek() throws when empty
}
```

### Using `clone` for safe mutable operations

```ts
const s = new Stack({ initValues: [1, 2, 3] })
const copy = s.clone()
const items = copy.toArray() // [1, 2, 3]
Stack.equals(s, copy) // true
```

---

## 6) Edge cases and best practices

- Use `isEmpty()` before `pop()` or `peek()` if you want to avoid exceptions.
- Use `top` when you prefer a non-throwing, idiomatic JS accessor.
- Use `size()` or `length` interchangeably — both return the same value.
- When constructing stacks from large arrays, prefer `assign(values)` or
  the `initValues` constructor option to avoid repeated reallocation costs.
- `clear()` frees nodes via their `cleanup()` helper; ensure that cleanup
  side effects (if any) are acceptable.

---

## 7) API Reference Table (quick sight)

| Name        | Signature                            | Description                                   | Complexity   |
| ----------- | ------------------------------------ | --------------------------------------------- | ------------ |
| Constructor | `new Stack(options?)`                | Create stack; accepts `initValues`, `factory` | O(n) w/ init |
| push        | `push(value: T)`                     | Push on top                                   | O(1)         |
| pop         | `pop(): T`                           | Remove and return top (throws if empty)       | O(1)         |
| emplace     | `emplace(...args: A)`                | Build using factory and push                  | O(1)+cost    |
| peek        | `peek(): T`                          | Inspect top (throws if empty)                 | O(1)         |
| top         | `get top(): T \| undefined`          | Inspect top non-throwing                      | O(1)         |
| isEmpty     | `isEmpty(): boolean`                 | True when empty                               | O(1)         |
| clear       | `clear(): void`                      | Remove all elements                           | O(n)         |
| toArray     | `toArray(): T[]`                     | Array copy (bottom -> top)                    | O(n)         |
| assign      | `assign(values\|count, ...)`         | Replace contents                              | O(n)         |
| forEach     | `forEach(callback)`                  | Iterate with early-stop support               | O(n)         |
| clone       | `clone(deepCloneFn?)`                | Create deep/shallow copy                      | O(n)         |
| size        | `size(): number`                     | Number of elements                            | O(1)         |
| length      | `get length(): number`               | Alias for `size()`                            | O(1)         |
| reversed    | `get reversed(): IterableIterator`   | Reverse iterator (top -> bottom)              | O(n)         |
| equals      | `static equals(s1, s2, comparator?)` | Compare two stacks                            | O(n)         |
| swap        | `static swap(s1, s2)`                | O(1) swap internal pointers                   | O(1)         |

---

## 8) Notes, limitations and contribution request

- This `Stack` focuses on clear semantics and beginner-friendly behaviour.
- We intentionally expose both non-throwing (`top`) and throwing
  (`peek`) accessors for ergonomic and defensive styles, respectively.
- If you discover a bug or have ideas for additional helpers (bounded
  stacks, peekMany, persistent stacks), please open an issue or submit a
  pull request with tests and examples.

Thank you for reading — contributions and questions are welcome!

---

_Created from code in `src/structures/stack.ts`. If you update the
implementation, consider updating this documentation accordingly._
