# Queue

A classic, robust and developer-friendly **Queue** (FIFO) data structure implemented in TypeScript using a **doubly linked list** internally. Designed for flexibility, extensibility, and performance with support for `emplace`, `clone`, STL-style iterators, and more.

---

## 🚀 Quick Start

```ts
import { Queue } from 'stl-kit'

const queue = new Queue<number>()
queue.push(10)
queue.push(20)
console.log(queue.pop()) // 10
```

---

## 🏗️ Constructor

```ts
new Queue<T, A>(options?: {
  initValues?: T[]
  factory?: (...args: A) => T
})
```

- `initValues`: Optional array of values to prefill the queue.
- `factory`: Optional factory for use with `emplace()`.

---

## 📚 Instance Methods

### `push(value: T): void`

Adds a value to the back of the queue.

```ts
queue.push(42)
```

---

### `pop(): T | undefined`

Removes and returns the front value. Returns `undefined` if empty.

```ts
const val = queue.pop()
```

---

### `peek(): T | undefined`

Returns the front value without removing it.

```ts
queue.peek()
```

---

### `emplace(...args: A): void`

Constructs and pushes a value using the provided factory.

```ts
const queue = new Queue<Person, [string, number]>({
  factory: (name, age) => new Person(name, age),
})
queue.emplace('Alice', 30)
```

---

### `assign(count: number, value: T): void`

Fills the queue with `count` copies of `value`.

```ts
queue.assign(3, 99) // [99, 99, 99]
```

---

### `assign(values: T[], start?: number, end?: number): void`

Fills the queue with a slice of `values`.

```ts
queue.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

---

### `clone(deepCloneFn?: (val: T) => T): Queue<T, A>`

Returns a deep copy of the queue. Defaults to `structuredClone`.

```ts
const deep = queue.clone()
const shallow = queue.clone((v) => v)
```

---

### `clear(): void`

Removes all elements.

```ts
queue.clear()
```

---

### `toArray(): T[]`

Returns a shallow copy of the queue as an array.

```ts
const arr = queue.toArray()
```

---

### `forEach(cb, thisArg?)`

Iterates through the queue from front to back.

```ts
queue.forEach((val, i) => console.log(val, i))
```

---

### `begin(): IterableIterator<T>`

Returns a forward iterator (default direction).

```ts
for (const val of queue.begin()) { ... }
```

---

### `rbegin(): IterableIterator<T>`

Returns a reverse iterator (from back to front).

```ts
for (const val of queue.rbegin()) { ... }
```

---

## 🧾 Properties

### `length: number`

Current number of elements in the queue.

### `front: T | undefined`

Getter/setter for the front value.

```ts
queue.front = 99
const val = queue.front
```

### `back: T | undefined`

Getter/setter for the back value.

```ts
queue.back = 42
const val = queue.back
```

---

## 🧰 Static Methods

### `Queue.equals(queue1, queue2, comparator?): boolean`

Checks equality of two queues. Optionally pass a comparator.

```ts
Queue.equals(queueA, queueB)
```

---

### `Queue.swap(queue1, queue2): void`

Swaps contents of two queues (must use same factory).

```ts
Queue.swap(queue1, queue2)
```

---

## ⚠️ Error Handling

- `front = val`/`back = val` throws if queue is empty.
- `assign()` throws if invalid range or arguments.
- `clone()` throws if `structuredClone` not available and no fallback provided.

---

## 🧠 Performance

| Operation  | Time Complexity |
| ---------- | --------------- |
| push / pop | O(1)            |
| assign     | O(n)            |
| clone      | O(n)            |
| toArray    | O(n)            |

---

## 💡 Compatibility

- Requires ES2022+ (`#private fields` and optional `structuredClone`)
- If using in Node.js < 18, provide a polyfill or custom `deepCloneFn`

---

## 📘 API Reference

| Method / Property | Signature                                           | Description                        |
| ----------------- | --------------------------------------------------- | ---------------------------------- |
| `push`            | `(value: T): void`                                  | Push a value to the back           |
| `pop`             | `(): T \| undefined`                                | Pop the front value from the queue |
| `peek`       | `(): T \| undefined`                                | Return the front value             |
| `emplace`         | `(...args: A): void`                                | Push using a factory               |
| `assign` (count)  | `(count: number, value: T): void`                   | Fill queue with repeated value     |
| `assign` (slice)  | `(values: T[], start?: number, end?: number): void` | Fill queue with slice of array     |
| `clone`           | `(deepCloneFn?): Queue<T, A>`                       | Clone the queue                    |
| `clear`           | `(): void`                                          | Empty the queue                    |
| `toArray`         | `(): T[]`                                           | Convert to array                   |
| `forEach`         | `(cb, thisArg?): void`                              | Loop through elements              |
| `begin`           | `(): IterableIterator<T>`                           | Forward iterator                   |
| `rbegin`          | `(): IterableIterator<T>`                           | Reverse iterator                   |
| `length`          | `number`                                            | Number of elements                 |
| `front`           | `T \| undefined` (getter/setter)                    | Get/set front value                |
| `back`            | `T \| undefined` (getter/setter)                    | Get/set back value                 |
| `Queue.equals`    | `(queue1, queue2, comparator?): boolean`            | Compare two queues                 |
| `Queue.swap`      | `(queue1, queue2): void`                            | Swap contents of two queues        |

---

## 📎 License & Contributions

This package is open-source under the MIT License. Feel free to submit issues or pull requests on GitHub.
