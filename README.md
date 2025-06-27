# Standard Template Library - JavaScript

A modern JavaScript library providing efficient and reusable implementations of common data structures and algorithms. Designed to simplify development by offering ready-to-use collections like lists, stacks, queues, deques, and more—with clean, consistent APIs and zero boilerplate.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Data Structures](#data-structures)
  - [LinkedList](#linkedlist)
    - [Overview](#overview)
    - [Basic Example](#basic-example)
    - [API Reference](#api-reference)
    - [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```sh
npm install stl
```

---

## Usage

Import the desired data structure:

```ts
import { LinkedList } from 'stl'
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

| Method / Property            | Description                                                        | Example Usage                |
| ---------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| `constructor(values?)`       | Create a new list, optionally initialized with an array of values. | `new LinkedList([1,2,3])`    |
| `pushFront(value)`           | Insert value at the front.                                         | `list.pushFront(5)`          |
| `pushBack(value)`            | Insert value at the back.                                          | `list.pushBack(10)`          |
| `popFront()`                 | Remove and return the front value.                                 | `list.popFront()`            |
| `popBack()`                  | Remove and return the back value.                                  | `list.popBack()`             |
| `insertAt(value, index)`     | Insert value at a specific index.                                  | `list.insertAt(42, 1)`       |
| `eraseAt(index)`             | Remove and return value at a specific index.                       | `list.eraseAt(0)`            |
| `assign(count, value)`       | Fill the list with `count` copies of `value`.                      | `list.assign(3, 7)`          |
| `assign(values, start, end)` | Fill the list with a slice of an array.                            | `list.assign([1,2,3], 0, 1)` |
| `clear()`                    | Remove all elements.                                               | `list.clear()`               |
| `isEmpty()`                  | Returns `true` if the list is empty.                               | `list.isEmpty()`             |
| `forEach(callback)`          | Iterate with a callback. Return `false` to break early.            | `list.forEach((v,i)=>{})`    |
| `[Symbol.iterator]()`        | Make the list iterable (for...of).                                 | `for (const v of list) {}`   |
| `length`                     | Number of elements in the list.                                    | `list.length`                |
| `front` (getter/setter)      | Get or set the front value.                                        | `list.front = 100`           |
| `back` (getter/setter)       | Get or set the back value.                                         | `list.back = 200`            |

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
