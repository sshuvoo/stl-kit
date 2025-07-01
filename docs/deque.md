# Deque (Double-Ended Queue)

A **Deque** (Double-Ended Queue) is a versatile linear data structure that allows insertion and removal of elements from both the front and the back. This flexibility makes it suitable for a wide range of applications, such as implementing both stacks and queues, managing sliding windows, and solving problems that require access to both ends of a collection.

## Features

- **Bidirectional Operations:** Add or remove elements from both ends efficiently.
- **Iterable:** Supports forward and reverse iteration.
- **Custom Element Construction:** Supports element creation via a factory function for complex types.
- **Flexible Initialization:** Can be initialized with an array of values.
- **Utility Methods:** Includes methods for assignment, clearing, conversion to array, and more.

## Example Usage

### Basic Operations

```typescript
import { Deque } from 'stl-kit'

const deque = new Deque<number>()
deque.pushBack(1) // [1]
deque.pushFront(2) // [2, 1]
deque.pushBack(3) // [2, 1, 3]

console.log(deque.front) // 2
console.log(deque.back) // 3

console.log(deque.popFront()) // 2, deque is now [1, 3]
console.log(deque.popBack()) // 3, deque is now [1]
```

### Iteration

```typescript
for (const value of deque) {
  console.log(value) // Iterates from front to back
}

for (const value of deque.rbegin()) {
  console.log(value) // Iterates from back to front
}
```

### Using a Factory for Complex Types

```typescript
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
const pointFactory = (x: number, y: number) => new Point(x, y)
const pointDeque = new Deque<Point>({ factory: pointFactory })
pointDeque.emplaceBack(1, 2)
pointDeque.emplaceFront(3, 4)
// pointDeque now contains [Point(3,4), Point(1,2)]
```

### Assigning Values

```typescript
const d = new Deque<number>()
d.assign(3, 7) // [7, 7, 7]
d.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

## Edge Cases

- **Empty Deque:**
  - `popFront()` and `popBack()` return `undefined` if the deque is empty.
  - Accessing `front` or `back` on an empty deque returns `undefined`.
- **Single Element:**
  - After removing the only element, both `front` and `back` become `undefined`.
- **Assign with Invalid Range:**
  - `assign([1,2,3], 2, 1)` throws a `RangeError` because start > end.
- **Assign with Negative Count:**
  - `assign(-1, 5)` throws a `RangeError` because count is negative.
- **Non-array Initialization:**
  - Initializing with a non-array value throws a `TypeError`.
- **Callback in forEach:**
  - Passing a non-function to `forEach` throws a `TypeError`.

## Method Examples

### constructor(options?)

```typescript
// With initial values
const dq1 = new Deque<number>({ initValues: [1, 2, 3] })
// With a factory
const dq2 = new Deque<{ x: number }>({ factory: (x) => ({ x }) })
```

### pushFront(value) and pushBack(value)

```typescript
const dq = new Deque<number>()
dq.pushFront(10) // [10]
dq.pushBack(20) // [10, 20]
```

### popFront() and popBack()

```typescript
const dq = new Deque([1, 2, 3])
dq.popFront() // 1, dq is now [2, 3]
dq.popBack() // 3, dq is now [2]
```

### emplaceFront(...args) and emplaceBack(...args)

```typescript
const dq = new Deque<string>({ factory: (a, b) => a + b })
dq.emplaceFront('A', 'B') // ['AB']
dq.emplaceBack('C', 'D') // ['AB', 'CD']
```

### isEmpty()

```typescript
const dq = new Deque()
dq.isEmpty() // true
dq.pushBack(1)
dq.isEmpty() // false
```

### clear()

```typescript
const dq = new Deque([1, 2, 3])
dq.clear()
dq.length // 0
dq.isEmpty() // true
```

### assign(count, value) and assign(values, start, end)

```typescript
const dq = new Deque<number>()
dq.assign(2, 5) // [5, 5]
dq.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

### forEach(cb, thisArg?)

```typescript
const dq = new Deque([1, 2, 3])
dq.forEach((v, i) => console.log(i, v))
// Output: 0 1\n1 2\n2 3
// Early break
dq.forEach((v) => (v === 2 ? false : undefined)) // Stops at value 2
```

### toArray()

```typescript
const dq = new Deque([1, 2, 3])
dq.toArray() // [1, 2, 3]
```

### at(index)

```typescript
const dq = new Deque(['a', 'b', 'c'])
dq.at(1) // 'b'
dq.at(10) // undefined
```

### begin() and rbegin()

```typescript
const dq = new Deque([1, 2, 3])
for (const v of dq.begin()) {
  // 1, 2, 3
}
for (const v of dq.rbegin()) {
  // 3, 2, 1
}
```

### length

```typescript
const dq = new Deque([1, 2])
dq.length // 2
dq.pushBack(3)
dq.length // 3
```

### front and back (getter/setter)

```typescript
const dq = new Deque([1, 2, 3])
dq.front // 1
dq.back // 3
dq.front = 10 // dq is now [10, 2, 3]
dq.back = 20 // dq is now [10, 2, 20]
```

### swap(q1, q2)

```typescript
const dq1 = new Deque([1, 2])
const dq2 = new Deque([3, 4])
Deque.swap(dq1, dq2)
dq1.toArray() // [3, 4]
dq2.toArray() // [1, 2]
```

## API Reference

| Method / Property       | Description                                                               | Signature                                                                      |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| `constructor(options?)` | Create a new deque, optionally with initial values and a factory.         | `new Deque<T, A>(options?: { initValues?: T[], factory?: (...args: A) => T })` |
| `pushFront(value)`      | Insert value at the front.                                                | `pushFront(value: T): void`                                                    |
| `pushBack(value)`       | Insert value at the back.                                                 | `pushBack(value: T): void`                                                     |
| `popFront()`            | Remove and return value from the front.                                   | `popFront(): T                                                                 | undefined`                 |
| `popBack()`             | Remove and return value from the back.                                    | `popBack(): T                                                                  | undefined`                 |
| `emplaceFront(...args)` | Construct and insert value at the front using factory or arguments.       | `emplaceFront(...args: A): void`                                               |
| `emplaceBack(...args)`  | Construct and insert value at the back using factory or arguments.        | `emplaceBack(...args: A): void`                                                |
| `isEmpty()`             | Check if the deque is empty.                                              | `isEmpty(): boolean`                                                           |
| `clear()`               | Remove all elements.                                                      | `clear(): void`                                                                |
| `assign(count, value)`  | Fill deque with `count` copies of `value`.                                | `assign(count: number, value: T): void`                                        |
| `assign(values, s, e)`  | Fill deque with a slice of `values` from `s` to `e` (exclusive).          | `assign(values: T[], start?: number, end?: number): void`                      |
| `forEach(cb, thisArg?)` | Iterate and call `cb` for each value. Breaks if callback returns `false`. | `forEach(callback: (value, index, deque) => void                               | false, thisArg?): void`    |
| `toArray()`             | Convert deque to array.                                                   | `toArray(): T[]`                                                               |
| `at(index)`             | Get value at index (0-based).                                             | `at(index: number): T                                                          | undefined`                 |
| `begin()`               | Get forward iterator.                                                     | `begin(): IterableIterator<T>`                                                 |
| `rbegin()`              | Get reverse iterator.                                                     | `rbegin(): IterableIterator<T>`                                                |
| `length`                | Number of elements.                                                       | `length: number`                                                               |
| `front`                 | Get/set value at the front.                                               | `front: T                                                                      | undefined` (getter/setter) |
| `back`                  | Get/set value at the back.                                                | `back: T                                                                       | undefined` (getter/setter) |
| `swap(q1, q2)`          | Static: Swap contents of two deques.                                      | `Deque.swap<U, V>(q1: Deque<U, V>, q2: Deque<U, V>): void`                     |
