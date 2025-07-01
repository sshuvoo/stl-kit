# LinkedList

A **LinkedList** is a doubly-linked linear data structure that allows efficient insertion and removal of elements at both ends and at arbitrary positions. It is ideal for scenarios where frequent insertions and deletions are required, and where random access is less important than sequential access.

## Features

- **Bidirectional Operations:** Add or remove elements from both the front and the back efficiently.
- **Arbitrary Positioning:** Insert or erase elements at any index.
- **Iterable:** Supports forward and reverse iteration.
- **Custom Element Construction:** Supports element creation via a factory function for complex types.
- **Flexible Initialization:** Can be initialized with an array of values.
- **Utility Methods:** Includes assignment, clearing, conversion to array, unique, remove, and more.

## Example Usage

### Basic Operations

```typescript
import { LinkedList } from 'stl-kit'

const list = new LinkedList<number>()
list.pushBack(1) // [1]
list.pushFront(2) // [2, 1]
list.pushBack(3) // [2, 1, 3]

console.log(list.front) // 2
console.log(list.back) // 3

console.log(list.popFront()) // 2, list is now [1, 3]
console.log(list.popBack()) // 3, list is now [1]
```

### Iteration

```typescript
for (const value of list) {
  console.log(value) // Iterates from front to back
}

for (const value of list.rbegin()) {
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
const pointList = new LinkedList<Point, [number, number]>({
  factory: pointFactory,
})
pointList.emplaceBack(1, 2)
pointList.emplaceFront(3, 4)
// pointList now contains [Point(3,4), Point(1,2)]
```

### Assigning Values

```typescript
const l = new LinkedList<number>()
l.assign(3, 7) // [7, 7, 7]
l.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

## Edge Cases

- **Empty List:**
  - `popFront()` and `popBack()` return `undefined` if the list is empty.
  - Accessing `front` or `back` on an empty list returns `undefined`.
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
- **Invalid Index:**
  - `insertAt` or `eraseAt` with an out-of-bounds index throws a `RangeError`.
- **Merging with Self:**
  - `LinkedList.merge(list, list)` throws an `Error`.

## Method Examples

### constructor(options?)

```typescript
// With initial values
const l1 = new LinkedList<number>({ initValues: [1, 2, 3] })
// With a factory
const l2 = new LinkedList<{ x: number }>({ factory: (x) => ({ x }) })
```

### pushFront(value) and pushBack(value)

```typescript
const l = new LinkedList<number>()
l.pushFront(10) // [10]
l.pushBack(20) // [10, 20]
```

### popFront() and popBack()

```typescript
const l = new LinkedList([1, 2, 3])
l.popFront() // 1, l is now [2, 3]
l.popBack() // 3, l is now [2]
```

### insertAt(value, index)

```typescript
const l = new LinkedList([1, 3])
l.insertAt(2, 1) // [1, 2, 3]
l.insertAt(0, 0) // [0, 1, 2, 3]
l.insertAt(4, 4) // [0, 1, 2, 3, 4]
```

### eraseAt(index)

```typescript
const l = new LinkedList([1, 2, 3, 4])
l.eraseAt(2) // 3, l is now [1, 2, 4]
```

### emplaceFront(...args), emplaceBack(...args), emplaceAt(index, ...args)

```typescript
const l = new LinkedList<string, [string, string]>({ factory: (a, b) => a + b })
l.emplaceFront('A', 'B') // ['AB']
l.emplaceBack('C', 'D') // ['AB', 'CD']
l.emplaceAt(1, 'X', 'Y') // ['AB', 'XY', 'CD']
```

### isEmpty()

```typescript
const l = new LinkedList()
l.isEmpty() // true
l.pushBack(1)
l.isEmpty() // false
```

### clear()

```typescript
const l = new LinkedList([1, 2, 3])
l.clear()
l.length // 0
l.isEmpty() // true
```

### assign(count, value) and assign(values, start, end)

```typescript
const l = new LinkedList<number>()
l.assign(2, 5) // [5, 5]
l.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

### forEach(cb, thisArg?)

```typescript
const l = new LinkedList([1, 2, 3])
l.forEach((v, i) => console.log(i, v))
// Output: 0 1\n1 2\n2 3
// Early break
l.forEach((v) => (v === 2 ? false : undefined)) // Stops at value 2
```

### toArray()

```typescript
const l = new LinkedList([1, 2, 3])
l.toArray() // [1, 2, 3]
```

### begin() and rbegin()

```typescript
const l = new LinkedList([1, 2, 3])
for (const v of l.begin()) {
  // 1, 2, 3
}
for (const v of l.rbegin()) {
  // 3, 2, 1
}
```

### length

```typescript
const l = new LinkedList([1, 2])
l.length // 2
l.pushBack(3)
l.length // 3
```

### front and back (getter/setter)

```typescript
const l = new LinkedList([1, 2, 3])
l.front // 1
l.back // 3
l.front = 10 // l is now [10, 2, 3]
l.back = 20 // l is now [10, 2, 20]
```

### swap(list1, list2)

```typescript
const l1 = new LinkedList([1, 2])
const l2 = new LinkedList([3, 4])
LinkedList.swap(l1, l2)
l1.toArray() // [3, 4]
l2.toArray() // [1, 2]
```

### merge(target, source, compareFn?)

```typescript
const l1 = new LinkedList([1, 3, 5])
const l2 = new LinkedList([2, 4, 6])
LinkedList.merge(l1, l2)
// l1 is now [1, 2, 3, 4, 5, 6], l2 is now []
```

### remove(value, compareFn?)

```typescript
const l = new LinkedList([1, 2, 2, 3])
l.remove(2) // 2, l is now [1, 3]
```

### unique(compareFn?)

```typescript
const l = new LinkedList([1, 1, 2, 2, 3])
l.unique() // l is now [1, 2, 3]
```

### buildNodes(values)

```typescript
const { head, tail } = LinkedList.buildNodes([1, 2, 3])
// head and tail are ListNode instances
```

## API Reference

| Method / Property       | Description                                                               | Signature                                                                                         |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `constructor(options?)` | Create a new linked list, optionally with initial values and a factory.   | `new LinkedList<T, A>(options?: { initValues?: T[], factory?: (...args: A) => T })`               |
| `pushFront(value)`      | Insert value at the front.                                                | `pushFront(value: T): void`                                                                       |
| `pushBack(value)`       | Insert value at the back.                                                 | `pushBack(value: T): void`                                                                        |
| `popFront()`            | Remove and return value from the front.                                   | `popFront(): T \| undefined`                                                                      |
| `popBack()`             | Remove and return value from the back.                                    | `popBack(): T \| undefined`                                                                       |
| `insertAt(value, idx)`  | Insert value at the specified index.                                      | `insertAt(value: T, index: number): void`                                                         |
| `eraseAt(idx)`          | Remove and return value at the specified index.                           | `eraseAt(index: number): T \| undefined`                                                          |
| `emplaceFront(...args)` | Construct and insert value at the front using factory or arguments.       | `emplaceFront(...args: A): void`                                                                  |
| `emplaceBack(...args)`  | Construct and insert value at the back using factory or arguments.        | `emplaceBack(...args: A): void`                                                                   |
| `emplaceAt(idx, ...a)`  | Construct and insert value at index using factory or arguments.           | `emplaceAt(index: number, ...args: A): void`                                                      |
| `isEmpty()`             | Check if the list is empty.                                               | `isEmpty(): boolean`                                                                              |
| `clear()`               | Remove all elements.                                                      | `clear(): void`                                                                                   |
| `assign(count, value)`  | Fill list with `count` copies of `value`.                                 | `assign(count: number, value: T): void`                                                           |
| `assign(values, s, e)`  | Fill list with a slice of `values` from `s` to `e` (exclusive).           | `assign(values: T[], start?: number, end?: number): void`                                         |
| `forEach(cb, thisArg?)` | Iterate and call `cb` for each value. Breaks if callback returns `false`. | `forEach(callback: (value, index, list) => void \| false, thisArg?): void`                        |
| `toArray()`             | Convert list to array.                                                    | `toArray(): T[]`                                                                                  |
| `begin()`               | Get forward iterator.                                                     | `begin(): IterableIterator<T>`                                                                    |
| `rbegin()`              | Get reverse iterator.                                                     | `rbegin(): IterableIterator<T>`                                                                   |
| `length`                | Number of elements.                                                       | `length: number`                                                                                  |
| `front`                 | Get/set value at the front.                                               | `front: T \| undefined` (getter/setter)                                                           |
| `back`                  | Get/set value at the back.                                                | `back: T \| undefined` (getter/setter)                                                            |
| `swap(list1, list2)`    | Static: Swap contents of two lists.                                       | `LinkedList.swap<U, V>(list1: LinkedList<U, V>, list2: LinkedList<U, V>): void`                   |
| `merge(target, source)` | Static: Merge sorted source into target, emptying source.                 | `LinkedList.merge<U, V>(target: LinkedList<U, V>, source: LinkedList<U, V>, compareFn?)`          |
| `remove(value, cmp?)`   | Remove all elements equal to value (optionally using compareFn).          | `remove(val: T, compareFn?): number`                                                              |
| `unique(cmp?)`          | Remove consecutive duplicates (optionally using compareFn).               | `unique(compareFn?): void`                                                                        |
| `buildNodes(values)`    | Static: Build a linked list of nodes from an array.                       | `LinkedList.buildNodes<T>(values: T[]): { head: ListNode<T> \| null, tail: ListNode<T> \| null }` |

---

<sub>If you found any bug, please create an issue to help make this library more reliable and efficient. Your feedback is highly appreciated!</sub>
