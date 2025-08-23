# A TypeScript-First Standard Template Library (STL) for Data Structures & Algorithms

<p align="center">
  <a href="https://github.com/sshuvoo/stl-kit/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="STL Kit is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.org/package/stl-kit">
    <img src="https://img.shields.io/npm/v/stl-kit?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://github.com/sshuvoo/stl-kit/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

A modern, high-performance JavaScript & TypeScript standard template library (STL) for classic and advanced data structures and algorithms. This library provides robust, type-safe, and reusable implementations of Stack, Queue, Deque, Linked List, Vector, Set, Map, Tree, Heap, Priority Queue, and Graph—designed for both beginners and professionals.

Use STL Kit to solve algorithmic problems, build efficient applications, or teach data structures in TypeScript or JavaScript. All data structures are optimized for performance and usability, with clean APIs and full documentation. Works seamlessly in Node.js, browser, and modern JavaScript/TypeScript projects.

Whether you need a fast priority queue for scheduling, a heap for sorting, or a linked list for flexible data manipulation, STL Kit has you covered. Explore the docs for detailed guides and examples.

---

## Table of Contents

- [A TypeScript-First Standard Template Library (STL) for Data Structures \& Algorithms](#a-typescript-first-standard-template-library-stl-for-data-structures--algorithms)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Data Structures Overview \& Quick Examples](#data-structures-overview--quick-examples)
    - [LinkedList](#linkedlist)
    - [Deque](#deque)
    - [Queue](#queue)
    - [Stack](#stack)
    - [Vector](#vector)
    - [PriorityQueue](#priorityqueue)
  - [Contributing](#contributing)
  - [License](#license)
  - [Coming Soon](#coming-soon)

---

## Installation

```sh
# Using npm
npm install stl-kit
# Using yarn
yarn add stl-kit
# Using pnpm
pnpm add stl-kit
```

---

## Data Structures Overview & Quick Examples

This section gives a short, practical introduction to the most used data
structures in STL Kit so you can get started quickly. Each entry shows the
purpose, the most commonly used methods from this implementation, a small
example you can copy, and a link to the full documentation in `docs/` for
complete details and advanced usage.

Important: examples show the library's actual method names (they match the
implementation in `src/structures`). For deeper explanations and edge cases,
follow the detailed guides linked below.

### LinkedList

Doubly-linked list useful when you need efficient insertion/removal at both
ends and constant-time splicing operations.

Common methods (from this implementation):

- `pushFront(value)`, `pushBack(value)` — add at head or tail
- `popFront()`, `popBack()` — remove from head or tail
- `insertAt(value, index)`, `eraseAt(index)` — insert or remove at index
- `isEmpty()`, `clear()`, `toArray()` — utility helpers

Example:

```js
import { LinkedList } from 'stl-kit'

const list = new LinkedList({ initValues: [1, 2, 3] })
list.pushFront(0) // [0, 1, 2, 3]
list.pushBack(4) // [0, 1, 2, 3, 4]
console.log(list.popFront()) // 0
console.log(list.popBack()) // 4
console.log(list.toArray()) // [1, 2, 3]
```

Full guide: [docs/linked-list.md](docs/linked-list.md)

### Deque

Double-ended queue implemented with a linked list. Use when you need a
queue that can push/pop at both ends efficiently.

Common methods:

- `pushFront(value)`, `pushBack(value)`
- `popFront()`, `popBack()`
- `front`, `back` getters/setters, `isEmpty()`, `toArray()`

Example:

```js
import { Deque } from 'stl-kit'

const dq = new Deque()
dq.pushBack(1)
dq.pushFront(0)
console.log(dq.front) // 0
console.log(dq.popBack()) // 1
```

Full guide: [docs/deque.md](docs/deque.md)

### Queue

FIFO queue using a linked list under the hood — ideal for breadth-first
algorithms and simple task scheduling.

Common methods:

- `push(value)`, `pop()`, `peek()`
- `isEmpty()`, `clear()`, `toArray()`

Example:

```js
import { Queue } from 'stl-kit'

const q = new Queue()
q.push('a')
q.push('b')
console.log(q.peek()) // 'a'
console.log(q.pop()) // 'a'
```

Full guide: [docs/queue.md](docs/queue.md)

### Stack

LIFO stack implemented with a linked list. Use for depth-first search,
function call simulation, or any LIFO ordering.

Common methods:

- `push(value)`, `pop()`
- `top` getter/setter, `peek()` (alias), `isEmpty()`, `toArray()`

Example:

```js
import { Stack } from 'stl-kit'

const s = new Stack()
s.push(1)
s.push(2)
console.log(s.top) // 2
console.log(s.pop()) // 2
```

Full guide: [docs/stack.md](docs/stack.md)

### Vector

Resizable array (extends JavaScript Array) with STL-style helpers. Use when
you want array semantics plus convenience methods found in classical STL
vectors.

Common methods:

- `pushBack(val)`, `popBack()`, `pushFront(val)`, `popFront()`
- `insertAt(index, val)`, `eraseAt(index)`, `resize(n)`
- `front`, `back`, `isEmpty()`

Example:

```js
import { Vector } from 'stl-kit'

const v = new Vector({ initValues: [1, 2, 3] })
v.pushBack(4)
v.insertAt(1, 9)
console.log(v.toString()) // ['1', '9', '2', '3', '4'] (Array methods work)
```

Full guide: [docs/vector.md](docs/vector.md)

### PriorityQueue

A high-performance priority queue backed by a binary heap (array-based).
By default it behaves as a numeric max-heap, but you can provide a
custom `compareFn` to change ordering (min-heap, object priorities, etc.).

Common methods:

- `push(node)`, `pop()` — insert and extract highest-priority element
- `peek()` — inspect highest-priority element without removing
- `replace(node)` — replace root and restore heap (more efficient than
  `pop()` + `push()`)
- `emplace(...args)` — construct in-place using provided factory
- `size()` / `length`, `toArray()`, `isEmpty()`

Example (max-heap by default):

```js
import { PriorityQueue } from 'stl-kit'

const pq = new PriorityQueue()
pq.push(1)
pq.push(5)
pq.push(3)
console.log(pq.peek()) // 5
console.log(pq.pop()) // 5
```

Example (min-heap via custom comparator):

```js
const minPQ = new PriorityQueue({ compareFn: (a, b) => b - a })
minPQ.push(5)
minPQ.push(1)
console.log(minPQ.pop()) // 1
```

Full guide: [docs/priority-queue.md](docs/priority-queue.md)

---

If you'd like a deeper tutorial or additional examples (TypeScript generics,
factories for `emplace`, working with objects, or performance tips), check
the linked docs under `docs/` or open an issue/PR so we can improve the
material.

## Contributing

Contributions, issues, and feature requests are welcome!
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[MIT](LICENSE)

---

## Coming Soon

- More algorithms and utilities!

---

> **Note:** This library is under active development. API may change as new features are added.
