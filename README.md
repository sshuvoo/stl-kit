# A TypeScript-First Standard Template Library (STL) for Data Structures & Algorithms

<p align="center">
  <a href="https://github.com/sshuvoo/javascript-stl/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="STL Kit is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.org/package/stl-kit">
    <img src="https://img.shields.io/npm/v/stl-kit?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://github.com/sshuvoo/javascript-stl/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

A modern, high-performance JavaScript & TypeScript standard template library (STL) for classic and advanced data structures and algorithms. This library provides robust, type-safe, and reusable implementations of Stack, Queue, Deque, Linked List, Vector, Set, Map, Tree, Heap, Priority Queue, and Graph—designed for both beginners and professionals.

Use STL Kit to solve algorithmic problems, build efficient applications, or teach data structures in TypeScript or JavaScript. All data structures are optimized for performance and usability, with clean APIs and full documentation. Works seamlessly in Node.js, browser, and modern JavaScript/TypeScript projects.

Whether you need a fast priority queue for scheduling, a heap for sorting, or a linked list for flexible data manipulation, STL Kit has you covered. Explore the docs for detailed guides and examples.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

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

Below are the main data structures included in STL Kit, with a quick example for each. For full API and advanced usage, see the linked documentation in the [docs/](./docs/) folder.

### LinkedList

Efficient doubly-linked list for fast insertions/removals.

```ts
import { LinkedList } from 'stl-kit'
const list = new LinkedList([1, 2, 3])
list.push(4)
console.log([...list]) // [1, 2, 3, 4]
```

See: [LinkedList Documentation](./docs/linked-list.md)

### Stack

LIFO (last-in, first-out) stack.

```ts
import { Stack } from 'stl-kit'
const stack = new Stack([1, 2])
stack.push(3)
console.log(stack.pop()) // 3
```

See: [Stack Documentation](./docs/stack.md)

### Queue

FIFO (first-in, first-out) queue.

```ts
import { Queue } from 'stl-kit'
const queue = new Queue([1, 2])
queue.push(3)
console.log(queue.pop()) // 1
```

See: [Queue Documentation](./docs/queue.md)

### Deque

Double-ended queue (push/pop from both ends).

```ts
import { Deque } from 'stl-kit'
const dq = new Deque([1, 2])
dq.unshift(0)
console.log(dq.pop()) // 2
```

See: [Deque Documentation](./docs/deque.md)

### Vector

Resizable array with fast random access.

```ts
import { Vector } from 'stl-kit'
const v = new Vector([1, 2])
v.push(3)
console.log(v.get(1)) // 2
```

See: [Vector Documentation](./docs/vector.md)

### Heap

Efficient min/max heap for priority-based access.

```ts
import { Heap } from 'stl-kit'
const heap = new Heap({ initValues: [5, 2, 8] })
heap.push(1)
console.log(heap.pop()) // 8 (default is max-heap)
```

See: [Heap Documentation](./docs/heap.md)

### PriorityQueue

Priority queue built on a heap. Use numbers or custom objects with priorities.

```ts
import { PriorityQueue } from 'stl-kit'
const pq = new PriorityQueue({ initValues: [5, 2, 8] })
pq.push(1)
console.log(pq.pop()) // 1 (min-heap by default)

// For custom objects:
const pq2 = new PriorityQueue({
  initValues: [
    { priority: 2, value: 'task2' },
    { priority: 1, value: 'task1' },
  ],
  compareFn: (a, b) => a.priority - b.priority,
})
console.log(pq2.pop()) // { priority: 1, value: 'task1' }
```

See: [PriorityQueue Documentation](./docs/priority-queue.md)

---

For full API, advanced usage, and more data structures, see the [docs/](./docs/) folder.

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
