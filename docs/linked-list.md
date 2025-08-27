# Linked List

This document explains what a doubly-linked list is, why and when you would
use one, how the `LinkedList` in this repository is implemented, and how to
use its public API. There are examples, common
patterns, edge cases, and a reference table for quick lookup.

---

## 1) What is a Linked List?

A linked list is a linear data structure that stores elements in nodes where
each node points to the next (and optionally the previous) node. Unlike
arrays, linked lists do not store elements in contiguous memory. Because of
this they are great for frequent insertions and removals at the ends or at
known positions.

In this repository we provide a _doubly-linked list_. That means each node
has a reference to its `next` and its `prev` (previous) node. This allows
fast O(1) insert/remove operations at both ends and O(1) removal of a node
if you already have a pointer to that node.

Real-life analogies:

- A train where each carriage is connected to the next and previous carriage
  — you can add or remove a carriage without touching the whole train.
- A paper list of tasks where you can insert a sticky note between any two
  items without reprinting the whole list.

Why use a linked list?

- You need to insert or remove items frequently at the front or back.
- You need stable references to nodes (an iterator that stays valid even if
  other parts change).
- You want a simple queue/deque-like structure but with more control.

When not to use it:

- If you mostly need random access by index (use an array or `Vector`).
- If memory locality and cache performance are critical (arrays are better).

---

## 2) How this `LinkedList` is implemented

File: `src/structures/linked-list.ts`

Key points:

- Each element is wrapped in a `ListNode` containing `val`, `next`, `prev`,
  and a `cleanup()` helper.
- The list keeps private `#head` and `#tail` pointers and an internal
  `#length` counter.
- Common operations are implemented: push/pop at both ends, insert/erase by
  index, emplace variants (construct via factory), iteration, and utility
  helpers like `assign`, `forEach`, `clear`, `toArray`, and `reverse`.
- There are a few static helpers: `swap`, `merge` (merge two sorted lists),
  and `buildNodes` (build head/tail pair from an array).
- The implementation throws clear errors for invalid usage (for example,
  trying to pop from an empty list).

Complexity overview (typical):

- pushFront / pushBack / popFront / popBack — O(1)
- insertAt / eraseAt — O(n) (need to traverse up to index)
- size / isEmpty / front / back — O(1)
- forEach / toArray / reverse / assign — O(n)

---

## 3) Public API — detailed explanations with examples

Below each method is explained with behaviour, typical complexity, common
edge cases to watch for, and small code examples (JavaScript/TypeScript).

> NOTE: Examples use the actual method names implemented in
> `src/structures/linked-list.ts`.

### Constructor

Signature:

- `new LinkedList<T, A extends unknown[] = unknown[]>({ initValues?, factory? } = {})`

What it does:

- Creates an empty doubly-linked list.
- `initValues` (optional): an array of initial values that will be appended
  in order to the newly created list (the constructor will call `pushBack`
  for each value).
- `factory` (optional): a factory function used by `emplace*` methods to
  construct elements from argument lists.

Complexity: O(n) if `initValues` is provided; O(1) otherwise.

Edge cases & notes:

- If `initValues` is provided but is not an array, the constructor throws a
  `TypeError`.
- If you rely on `emplace*` methods, make sure you provided a `factory`.

Example:

```ts
import { LinkedList } from 'stl-kit'

const list = new LinkedList<number>()
const initialized = new LinkedList({ initValues: [1, 2, 3] })

// with factory (emplace)
class Point {
  constructor(public x: number, public y: number) {}
}

const fList = new LinkedList<Point, [number, number]>({
  factory: (x, y) => new Point(x, y),
})

// even better type inference (Recommended)
const fList = new LinkedList({
  factory: (x: number, y: number) => new Point(x, y),
})

fList.emplaceBack(2, 3) // pushes { x: 2, y: 3 }
```

---

### Iteration: `Symbol.iterator`, `rbegin`, `begin`

What they do:

- `for (const v of list)` iterates from head (front) to tail (back).
- `rbegin()` yields values from tail to head (reverse iteration).
- `begin()` is an alias for the forward iterator.

Edge cases:

- Iteration yields values in the current list order. Mutating the list
  while iterating can cause surprising behaviour and should be avoided.

Example:

```ts
for (const val of initialized) console.log(val)
console.log([...initialized.rbegin()]) // reversed array
```

---

### pushFront(value) / pushBack(value)

What they do:

- Add `value` to the front or back of the list. If the list was empty the
  head and tail both point to the new node.

Complexity: O(1)

Edge cases:

- Works on empty lists (initializes head/tail).

Example:

```ts
const l = new LinkedList<number>()
l.pushBack(1)
l.pushFront(0)
console.log(l.toArray()) // [0, 1]
```

---

### popFront() / popBack()

What they do:

- Remove and return the front/back value. If the list is empty they throw
  an Error (this implementation's chosen behaviour).

Complexity: O(1)

Edge cases:

- Calling on an empty list throws an `Error` with a clear message.
- Single-element lists are handled (head and tail become null after pop).

Example:

```ts
const l = new LinkedList([1])
console.log(l.popFront()) // 1
// now list is empty, further pops will throw
```

---

### insertAt(val, index)

What it does:

- Insert `val` at the 0-based `index`. Inserting at 0 prepends and at
  `size()` appends.

Complexity: O(n) (must traverse up to `index`)

Edge cases:

- Throws `RangeError` if `index` is outside [0, size()].
- Inserting at 0 delegates to `pushFront`, inserting at `size()` delegates
  to `pushBack`.

Example:

```ts
const l = new LinkedList([1, 3])
l.insertAt(2, 1)
console.log(l.toArray()) // [1, 2, 3]
```

---

### eraseAt(index)

What it does:

- Remove and return the element at `index`.

Complexity: O(n) worst case

Edge cases:

- Throws `Error` if the list is empty.
- Throws `RangeError` if `index` is out of bounds.
- Removing at 0 or `size()-1` delegates to `popFront`/`popBack`.

Example:

```ts
const l = new LinkedList([1, 2, 3])
console.log(l.eraseAt(1)) // 2
console.log(l.toArray()) // [1, 3]
```

---

### emplaceFront / emplaceBack / emplaceAt

What they do:

- Use the `factory` provided to the constructor to build an element from
  provided arguments and insert it (front/back/at index).

Complexity: O(1) for construction + O(1) insertion at ends or O(n) when
inserting at index.

Edge cases:

- Throw `Error` if the list was created without a `factory`.

Example:

```ts
const f = new LinkedList({
  factory: (a: number, b: number) => a * 10 + b,
})
f.emplaceBack(1, 2) // inserts 12
```

---

### isEmpty(), size(), length (getter), clear(), toArray()

- `isEmpty()` — returns true when list has no elements (O(1)).
- `size()` — returns number of elements (O(1)).
- `length` — getter alias for `size()`.
- `clear()` — removes all elements and resets list (O(n) to cleanup nodes).
- `toArray()` — returns a shallow copy of values in order (O(n)).

Example:

```ts
const l = new LinkedList([1, 2, 3])
console.log(l.size(), l.length, l.isEmpty()) // 3 3 false
l.clear()
console.log(l.isEmpty()) // true
```

---

### assign(...) overloads

Signatures:

- `assign(values: T[], start?: number, end?: number)` — copy a slice
  of an array into the list
- `assign(count: number, value: T)` — fill the list with `count` copies of
  `value`

Both versions clear the list and then populate it. They throw on invalid
arguments (slice bounds or negative counts).

Example:

```ts
const l = new LinkedList<number>()
l.assign([1, 2, 3, 4], 1, 3)
console.log(l.toArray()) // [2, 3]

l.assign(3, 7)
console.log(l.toArray()) // [7, 7, 7]
```

---

### forEach(callback, thisArg?)

What it does:

- Calls `callback(value, index, list)` for each element in order.
- If `callback` returns `false`, iteration stops early.

Edge cases:

- Throws `TypeError` if `callback` is not a function.

Example:

```ts
const l = new LinkedList([1, 2, 3])
let sum = 0
l.forEach((v) => (sum += v))
console.log(sum) // 6
```

---

### reverse()

What it does:

- Reverse the list in-place. Head becomes tail and vice versa.

Complexity: O(n)

Edge cases:

- Safe for empty and single-element lists.

Example:

```ts
const l = new LinkedList([1, 2, 3])
l.reverse()
console.log(l.toArray()) // [3, 2, 1]
```

---

### remove(val, compareFn?)

What it does:

- Remove all elements matching `val` according to `compareFn` (default is
  strict equality `===`). Returns the number of removed elements.

Complexity: O(n)

Edge cases:

- When list is empty returns 0.
- Throws `TypeError` if `compareFn` is not a function.

Example:

```ts
const l = new LinkedList([1, 2, 2, 3])
console.log(l.remove(2)) // 2
console.log(l.toArray()) // [1, 3]
```

---

### Getters & Setters: front, back

- `front` getter/setter — access or set value at the head.
- `back` getter/setter — access or set value at the tail.

Both getters throw `Error` on empty lists; setters throw `Error` when the
list is empty to avoid silently creating nodes.

Example:

```ts
const l = new LinkedList([1, 2, 3])
console.log(l.front) // 1
l.front = 10
console.log(l.toArray()) // [10, 2, 3]
```

---

### Static helpers: swap(target, source), merge(target, source, compareFn), buildNodes(values)

`swap(list1, list2)` — O(1) swap of two lists' internal pointers and lengths.
Throws `TypeError` if either argument is not a `LinkedList`.

`merge(target, source, compareFn)` — Merge a sorted `source` list into a
sorted `target` list according to `compareFn`. This relinks nodes in-place
and leaves `source` empty. Both lists must be instances of `LinkedList`.

`buildNodes(values)` — Helper that converts an array into a `head`/`tail`
pair of `ListNode` (useful when constructing custom lists from arrays).

Example (merge):

```ts
const a = new LinkedList([1, 3, 5])
const b = new LinkedList([2, 4, 6])
LinkedList.merge(a, b, (x, y) => x - y)
console.log(a.toArray()) // [1,2,3,4,5,6]
console.log(b.size()) // 0
```

---

## 4) Usage patterns and examples (full)

### Basic usage

```ts
const list = new LinkedList<number>()
list.pushBack(1)
list.pushBack(2)
list.pushFront(0)
console.log(list.toArray()) // [0,1,2]
```

### Emplace with factory

```ts
const factoryList = new LinkedList<{ x: number; y: number }, [number, number]>({
  factory: (x, y) => ({ x, y }),
})
factoryList.emplaceBack(1, 2)
console.log(factoryList.toArray()) // [{x:1,y:2}]
```

### Safe traversal and early break

```ts
const l = new LinkedList([1, 2, 3, 4])
let arr: number[] = []
l.forEach((v) => {
  arr.push(v)
  if (v === 3) return false // stop early
})
console.log(arr) // [1,2,3]
```

---

## 5) Edge cases and best practices

- Check `isEmpty()` before calling `popFront`, `popBack`, `eraseAt`, or
  accessing `front`/`back` to avoid thrown errors, or be prepared to catch
  the thrown `Error`.
- Use `assign` when you need to replace the entire contents from an array
  or repeat a value N times.
- Prefer `pushFront`/`pushBack` for O(1) insertion at ends; `insertAt` is
  O(n) and should be used when necessary.
- When merging, ensure both lists are sorted with the same `compareFn`.
- `remove` can be used with a custom equality function for complex types
  (e.g. case-insensitive string remove).

---

## 6) API Reference Table (quick sight)

| Name         | Signature                                  | Description                                        | Complexity                    |
| ------------ | ------------------------------------------ | -------------------------------------------------- | ----------------------------- |
| Constructor  | `new LinkedList(options?)`                 | Create list; options: `initValues`, `factory`      | O(n) w/ init                  |
| pushFront    | `pushFront(value: T)`                      | Insert at head                                     | O(1)                          |
| pushBack     | `pushBack(value: T)`                       | Insert at tail                                     | O(1)                          |
| popFront     | `popFront(): T`                            | Remove and return head (throws if empty)           | O(1)                          |
| popBack      | `popBack(): T`                             | Remove and return tail (throws if empty)           | O(1)                          |
| insertAt     | `insertAt(val: T, index: number)`          | Insert at index (0..size)                          | O(n)                          |
| eraseAt      | `eraseAt(index: number): T`                | Remove item at index (throws if empty)             | O(n)                          |
| emplaceFront | `emplaceFront(...args: A)`                 | Build with factory and insert at front             | O(1)+cost                     |
| emplaceBack  | `emplaceBack(...args: A)`                  | Build with factory and insert at back              | O(1)+cost                     |
| emplaceAt    | `emplaceAt(index: number, ...args: A)`     | Build with factory and insert at index             | O(n)+cost                     |
| isEmpty      | `isEmpty(): boolean`                       | True when empty                                    | O(1)                          |
| size         | `size(): number`                           | Number of elements                                 | O(1)                          |
| length       | `get length(): number`                     | Getter alias for size                              | O(1)                          |
| clear        | `clear(): void`                            | Remove all elements                                | O(n)                          |
| toArray      | `toArray(): T[]`                           | Shallow copy of values (head -> tail)              | O(n)                          |
| assign       | `assign(values, count, ...)`               | Replace contents (overloaded)                      | O(n)                            |
| forEach      | `forEach(callback)`                        | Iterate with early-stop support                    | O(n)                          |
| reverse      | `reverse(): void`                          | Reverse list in-place                              | O(n)                          |
| remove       | `remove(val, compareFn?) : number`         | Remove all matching values                         | O(n)                          |
| front        | `get/set front`                            | Access or set head value (throws get/set on empty) | O(1)                          |
| back         | `get/set back`                             | Access or set tail value (throws get/set on empty) | O(1)                          |
| swap         | `static swap(list1, list2)`                | O(1) swap internal pointers                        | O(1)                          |
| merge        | `static merge(target, source, compareFn?)` | Merge sorted source into target (source emptied)   | O(n)                          |
| buildNodes   | `static buildNodes(values: T[])`           | Build head/tail node pair from array               | O(n)                          |

---

## 7) Notes, limitations and contribution request

- This `LinkedList` aims to be correct, readable, and beginner-friendly.
  However, bugs are possible. If you find a bug, please open an issue or
  submit a pull request with a failing test and a proposed fix.
- For performance-critical workloads prefer array-backed containers like
  `Vector` unless you specifically need linked-list characteristics.
- If you want additional methods (splice, unique, stable-sorting helpers,
  or iterators that return node objects), open a discussion so we can
  consider adding them.

Thank you for reading — contributions and questions are welcome!

---

_Created from code in `src/structures/linked-list.ts`. If you update the
implementation, consider updating this documentation accordingly._
