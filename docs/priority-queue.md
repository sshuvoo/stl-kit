# Priority Queue (PriorityQueue)

This document explains what a Priority Queue is, why we use it, how it works under the hood (binary heap), and how to use the `PriorityQueue` implementation in this repository (`src/structures/priority-queue.ts`). it also serves as a robust reference for developers.

---

## 1) What is a Priority Queue?

A priority queue is a special kind of queue. In a normal queue the first item you put in is the first you get out (FIFO). In a priority queue, each item has a "priority" and the item with the highest priority comes out first.

Simple example: imagine a line at the doctor's office. People with serious problems get seen before people with a small cough. People with higher priority are served earlier.

Why use a priority queue?

- When you need to always pick the next most important item.
- Great for scheduling tasks, event handling, Dijkstra's shortest path, A\* search, and many algorithm problems.

Real-life examples:

- Task schedulers (OS or job queues) pick the next important job to run.
- Networking: deciding which packet to send first if some packets are more important.
- Emergency room triage: more severe patients are treated first.
- Algorithms: Dijkstra's algorithm chooses the next node with smallest distance.

---

## 2) How is a Priority Queue implemented? (Binary Heap)

A common and efficient implementation of a priority queue is a binary heap. A binary heap is a complete binary tree where every parent node obeys a relationship with its children:

- Max-heap: a parent node's value >= its children (so root is the maximum value).
- Min-heap: a parent node's value <= its children (so root is the minimum value).

Why binary heap?

- It supports insertion and removal of the top priority item in O(log n) time.
- It is memory friendly: we can store the heap in a simple array (no pointers needed).

### Representing a heap in an array

If we store nodes level-by-level in an array (0-based index):

- Parent index of node at i: Math.floor((i - 1) / 2)
- Left child index of node at i: 2 \* i + 1
- Right child index of node at i: 2 \* i + 2

This mapping makes it fast and simple to move elements up or down the tree:

- heapifyUp (bubble up): after inserting at the end, compare to parent and swap if needed.
- heapifyDown (bubble down): after removing root and replacing with last element, swap downward with the larger (or smaller) child until the heap property is satisfied.

---

## 3) Relation: Heap and Priority Queue

- Priority queue is the abstract data structure: "I want to always get the highest priority element."
- Binary heap is one efficient way to implement a priority queue.

Think: PriorityQueue = the concept; Heap = one smart way to store it.

---

## 4) Implementation notes for this repository

File: `src/structures/priority-queue.ts`

Main points of this implementation:

- Uses a binary heap in a flat array (internal private array `#heap`).
- Default comparator works for numbers and creates a max-heap by default.
- You can pass a custom `compareFn` to change ordering (for objects or to make a min-heap).
- There is an optional `factory` used by `emplace` to construct elements in-place.
- Public API methods: constructor, `push`, `emplace`, `replace`, `pop`, `peek`, `isEmpty`, `clear`, `size`, `length` (getter), `toArray`, and an iterator (`for...of` / spread).

Comparator contract:

- `compareFn(a, b)` must return:
  - > 0 if `a` has higher priority than `b` (a comes first)
  - < 0 if `a` has lower priority than `b`
  - 0 if they are equal

Note: The default comparator only supports numbers. If you store other types (string, objects) and don't provide a comparator, the queue will throw at runtime.

---

## 5) Public API — detailed explanations with examples

Each method below is explained with behaviour, complexity, common edge cases, and examples in TypeScript.

### Constructor

Signature:

- `new PriorityQueue<T, A extends unknown[] = unknown[]>({ initValues?, compareFn?, factory? } = {})`

What it does:

- Creates a new PriorityQueue.
- `initValues` (optional): an array of initial elements. The constructor will transform (heapify) it into a valid heap in-place.
- `compareFn` (optional): custom comparator that defines the priority ordering.
- `factory` (optional): factory function used by `emplace` to construct items from arguments.

Complexity: O(n) when `initValues` is provided (heapify), O(1) otherwise.

Edge cases & notes:

- If `initValues` is passed and is not an array, it throws TypeError.
- Default comparator only understands numbers. Passing non-number items without a comparator will cause TypeError at runtime.

Example:

```ts
import { PriorityQueue } from 'stl-kit'
```

```ts
// default: number max-heap
const pq = new PriorityQueue<number>()

// with initial values (will be heapified)
const pq2 = new PriorityQueue<number>({ initValues: [3, 1, 4, 2] })

// with custom comparator (create min-heap)
const minPQ = new PriorityQueue<number>({ compareFn: (a, b) => b - a })

// with factory for emplace
interface Area {
  width: number
  height: number
  area: number
}
const pf = new PriorityQueue<Area>({
  factory: (w: number, h: number) => ({ width: w, height: h, area: w * h }),
})
pf.emplace(10, 5) // adds { width: 10, height: 5, area: 50 }
```

---

### push(node: T): void

What it does:

- Insert `node` into the queue and restore heap property by moving it up if needed.

Complexity: O(log n)

Edge cases:

- Works fine when queue is empty.
- If your comparator throws for the given types, push will throw.

Example:

```ts
pq.push(10)
pq.push(2)
```

---

### emplace(...args: A): void

What it does:

- Calls the `factory` (provided to the constructor) with the supplied arguments to create an element of type `T`, then inserts it into the queue.

Complexity: O(log n) plus cost of factory

Edge cases:

- Throws Error if `factory` was not provided when the queue was constructed.

Example:

```ts
// constructor: factory: (a, b) => a + b
pq.emplace(2, 3) // calls factory(2, 3) then pushes result
```

---

### replace(node: T): T

What it does:

- Replaces the root element (highest-priority element) with `node`, restores heap property by sifting down, and returns the replaced element.

Complexity: O(log n)

Edge cases:

- Throws Error if heap is empty.
- More efficient than doing `pop()` then `push(node)` because it avoids two separate heap operations.

Example:

```ts
pq.push(3)
pq.push(5)
const oldTop = pq.replace(10) // oldTop is 5, new top is 10
```

---

### pop(): T

What it does:

- Removes and returns the highest-priority element (the root).
- Replaces root with last element and sifts down to restore heap property.

Complexity: O(log n)

Edge cases:

- Throws Error if heap is empty.

Example:

```ts
const val = pq.pop()
```

---

### peek(): T | undefined

What it does:

- Returns the highest-priority element without removing it.

Complexity: O(1)

Edge cases:

- Returns `undefined` when the queue is empty.

Example:

```ts
const top = pq.peek()
```

---

### isEmpty(): boolean

What it does:

- Returns `true` when the queue has no elements.

Complexity: O(1)

Example:

```ts
if (pq.isEmpty()) console.log('no items')
```

---

### clear(): void

What it does:

- Removes all elements (resets internal array length to 0).

Complexity: O(1)

Example:

```ts
pq.clear()
```

---

### size(): number and length getter

What it does:

- `size()` returns the number of elements following an STL-like API.
- `length` getter is a JS-friendly property that returns the same value.

Complexity: O(1)

Example:

```ts
console.log(pq.size(), pq.length)
```

---

### toArray(): T[]

What it does:

- Returns a shallow copy of the internal heap array.

Important: the returned array is in "heap order" (internal array), not sorted by priority. To get sorted output, repeatedly call `pop()` or use `Array.from(pq).sort(...)` depending on comparator.

Complexity: O(n)

Example:

```ts
const arr = pq.toArray()
```

---

### Iterator (Symbol.iterator)

What it does:

- Allows `for (const v of pq)` or spread `[...pq]` which yields items in internal heap order.

Example:

```ts
for (const v of pq) console.log(v)
const copy = [...pq]
```

---

## 6) Examples and patterns (complete)

Below are several usage patterns and what to expect.

### 6.1 Basic numeric max-heap (default)

```ts
const pq = new PriorityQueue<number>()
pq.push(1)
pq.push(99)
pq.push(42)
console.log(pq.peek()) // 99 (largest)
console.log(pq.pop()) // 99
console.log(pq.pop()) // 42
console.log(pq.pop()) // 1
```

### 6.2 Min-heap using custom comparator

```ts
const minPQ = new PriorityQueue<number>({ compareFn: (a, b) => b - a })
minPQ.push(5)
minPQ.push(2)
minPQ.push(9)
console.log(minPQ.pop()) // 2 (smallest because comparator inverted)
```

### 6.3 Objects with comparator

```ts
type Job = { id: string; priority: number }
const jobPQ = new PriorityQueue<Job>({
  compareFn: (a, b) => a.priority - b.priority, // larger priority => larger number => bigger priority
})
jobPQ.push({ id: 'A', priority: 10 })
jobPQ.push({ id: 'B', priority: 20 })
console.log(jobPQ.pop().id) // 'B'
```

### 6.4 Using factory + emplace

```ts
const pf = new PriorityQueue<{ v: number }>({
  factory: (n: number) => ({ v: n }),
})
pf.emplace(7) // creates object { v: 7 } and pushes it
```

### 6.5 Heapify from initial array

```ts
const p = new PriorityQueue<number>({ initValues: [4, 1, 7, 3, 9] })
// the constructor builds a valid heap from the array
console.log(p.pop()) // highest value according to comparator
```

### 6.6 Convert heap to sorted list (non-destructive copy)

If you want sorted elements without modifying the original queue, copy it first then repeatedly pop on the copy:

```ts
const copy = new PriorityQueue<number>({
  initValues: pq.toArray(),
  compareFn: pqCompare,
})
const sorted: number[] = []
while (!copy.isEmpty()) sorted.push(copy.pop())
```

### 6.7 Error cases to keep in mind

- Calling `.pop()` or `.replace()` on an empty queue throws an Error.
- Calling `.emplace(...)` when you did not provide a `factory` throws an Error.
- Using default comparator with non-number types throws a TypeError at runtime. Provide `compareFn` when storing strings or objects.

---

## 7) API Reference Table (quick sight)

| Name        |                     Signature | Description                                                |                     Complexity | Throws                              |
| ----------- | ----------------------------: | ---------------------------------------------------------- | -----------------------------: | ----------------------------------- | --- |
| Constructor | `new PriorityQueue(options?)` | Create queue. Accepts `initValues`, `compareFn`, `factory` | O(n) if `initValues` else O(1) | TypeError if `initValues` not array |
| push        |               `push(node: T)` | Insert element into queue                                  |                       O(log n) | If comparator throws                |
| emplace     |         `emplace(...args: A)` | Create element with factory and insert                     |             O(log n) + factory | Error if no factory                 |
| replace     |         `replace(node: T): T` | Replace root and return old root                           |                       O(log n) | Error if empty                      |
| pop         |                    `pop(): T` | Remove and return root                                     |                       O(log n) | Error if empty                      |
| peek        |                    `peek(): T | undefined`                                                 |   Return root without removing | O(1)                                | -   |
| isEmpty     |          `isEmpty(): boolean` | True when empty                                            |                           O(1) | -                                   |
| clear       |               `clear(): void` | Remove all elements                                        |                           O(1) | -                                   |
| size        |              `size(): number` | Number of elements                                         |                           O(1) | -                                   |
| length      |        `get length(): number` | Same as size (property)                                    |                           O(1) | -                                   |
| toArray     |              `toArray(): T[]` | Shallow copy of internal heap array (heap order)           |                           O(n) | -                                   |
| iterator    |         `[Symbol.iterator]()` | Iterate heap array order                                   |                   O(n) overall | -                                   |

---

## 8) Notes, limitations, and contribution request

- This implementation uses a default numeric comparator. If you store anything other than numbers, supply a `compareFn` that knows how to compare your elements.
- The `toArray()` and iterator yield the internal heap order; that order is not sorted. To extract ordered elements, use `pop()` repeatedly (or copy + pop on the copy).
- Performance: push/pop/replace run in O(log n). peek/isEmpty/size are O(1).
- This library aims to be stable, but bugs can exist. If you find problems or want improvements, please open an issue or submit a pull request on the project repository. If you want to request a new feature or discuss design, open a discussion.

Thank you for reading — contributions and questions are welcome!

---

_Created from code in `src/structures/priority-queue.ts`. If you update the implementation, consider updating this documentation accordingly._
