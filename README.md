# Standard Template Library - JavaScript

A modern JavaScript library providing efficient and reusable implementations of common data structures and algorithms. Designed to simplify development by offering ready-to-use collections like linked lists, stacks, queues, deques, and more—with clean, consistent APIs and zero boilerplate.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Data Structures](#data-structures)
  - [LinkedList](#linkedlist)
    - [Overview](#overview)
    - [Basic Example](#basic-example)
    - [API Reference](#api-reference)
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

## Usage

Import the desired data structure:

```ts
// Using ES6 import
import { LinkedList } from 'stl-kit'
// Using CommonJS require
const { LinkedList } = require('stl-kit')
```

---

## Data Structures

### LinkedList

#### Overview

A doubly linked list implementation supporting fast insertions and deletions at both ends, as well as indexed access and iteration. Generic and type-safe for all JavaScript/TypeScript types.

#### Basic Example

---

### Constructor

#### `new LinkedList<T>(values?: T[])`

Create a new list, optionally initialized with an array of values.

```ts
const list = new LinkedList<number>() // Empty list
const list2 = new LinkedList(['a', 'b', 'c']) // ['a', 'b', 'c']
```

---

### Methods & Properties

#### `.pushFront(value: T): void`

Insert value at the front.

```ts
list.pushFront(10) // [10]
```

---

#### `.pushBack(value: T): void`

Insert value at the back.

```ts
list.pushBack(20) // [10, 20]
```

---

#### `.popFront(): T | void`

Remove and return the front value.

```ts
const first = list.popFront() // 10, list is now [20]
```

---

#### `.popBack(): T | void`

Remove and return the back value.

```ts
const last = list.popBack() // 20, list is now []
```

---

#### `.insertAt(value: T, index: number): void`

Insert value at a specific index.

```ts
list.pushBack(1)
list.pushBack(3)
list.insertAt(2, 1) // [1, 2, 3]
```

---

#### `.eraseAt(index: number): T | void`

Remove and return value at a specific index.

```ts
const removed = list.eraseAt(1) // 2, list is now [1, 3]
```

---

#### `.assign(count: number, value: T): void`

Fill the list with `count` copies of `value`.

```ts
list.assign(3, 7) // [7, 7, 7]
```

---

#### `.assign(values: T[], start?: number, end?: number): void`

Fill the list with a slice of an array.

```ts
list.assign([1, 2, 3, 4], 1, 2) // [2, 3]
```

---

#### `.clear(): void`

Remove all elements.

```ts
list.clear() // []
```

---

#### `.isEmpty(): boolean`

Returns `true` if the list is empty.

```ts
list.isEmpty() // true
```

---

#### `.forEach(callback: (value: T, index: number) => void | false): void`

Iterate with a callback. Return `false` to break early.

```ts
list.assign([1, 2, 3])
list.forEach((value, index) => {
  console.log(value, index)
  if (value === 2) return false // break early
})
```

---

#### `.reverse(): void`

Reverse the list connection.

```ts
// list [1, 2, 3]
list.reverse() // [3, 2, 1]
```

---

#### `Iteration: Iterator<T>`

```ts
for (const value of list) {
  // ...
}
```

---

#### `.begin(): Iterator<T>`

Returns an iterator to the beginning of the list.

```ts
const it = list.begin()
console.log(it.next().value) // First value
```

---

#### `.length: number`

Number of elements in the list.

```ts
console.log(list.length) // 3
```

---

#### `.front: T | void` (getter/setter)

Get or set the front value.

```ts
console.log(list.front) // 1
list.front = 100 // [100, 2, 3]
```

---

#### `.back: T | void` (getter/setter)

Get or set the back value.

```ts
console.log(list.back) // 3
list.back = 200 // [100, 2, 200]
```

---

#### API Reference

#### API Reference

| Method / Property            | Description                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| `constructor(values?)`       | Create a new list, optionally initialized with an array of values.<br>T.C: O(n), S.C: O(n) |
| `pushFront(value)`           | Insert value at the front.<br>T.C: O(1), S.C: O(1)                                         |
| `pushBack(value)`            | Insert value at the back.<br>T.C: O(1), S.C: O(1)                                          |
| `popFront()`                 | Remove and return the front value.<br>T.C: O(1), S.C: O(1)                                 |
| `popBack()`                  | Remove and return the back value.<br>T.C: O(1), S.C: O(1)                                  |
| `insertAt(value, index)`     | Insert value at a specific index.<br>T.C: O(n), S.C: O(1)                                  |
| `eraseAt(index)`             | Remove and return value at a specific index.<br>T.C: O(n), S.C: O(1)                       |
| `assign(count, value)`       | Fill the list with `count` copies of `value`.<br>T.C: O(n), S.C: O(n)                      |
| `assign(values, start, end)` | Fill the list with a slice of an array.<br>T.C: O(n), S.C: O(n)                            |
| `clear()`                    | Remove all elements.<br>T.C: O(n), S.C: O(1)                                               |
| `isEmpty()`                  | Returns `true` if the list is empty.<br>T.C: O(1), S.C: O(1)                               |
| `forEach(callback)`          | Iterate with a callback. Return `false` to break early.<br>T.C: O(n), S.C: O(1)            |
| `reverse()`                  | Reverse the current list.<br>T.C: O(n), S.C: O(1)                                          |
| `[Symbol.iterator]()`        | Make the list iterable (for...of).<br>T.C: O(1), S.C: O(1)                                 |
| `length`                     | Number of elements in the list.<br>T.C: O(1), S.C: O(1)                                    |
| `front` (getter/setter)      | Get or set the front value.<br>T.C: O(1), S.C: O(1)                                        |
| `back` (getter/setter)       | Get or set the back value.<br>T.C: O(1), S.C: O(1)                                         |

## Contributing

Contributions, issues, and feature requests are welcome!  
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[MIT](LICENSE)

---

## Coming Soon

- Stack
- Queue
- Deque
- More algorithms and utilities!

---

> **Note:** This library is under active development. API may change as new features
