# Queue

A classic queue (FIFO) data structure implementation for JavaScript/TypeScript, supporting efficient push and pop operations, iteration, and advanced features like emplace and static utilities. Generic and type-safe for all types.

---

## Constructor

### `new Queue(values?: T[], TypeCtor?: Constructor<T, A>)`

Create a new queue, optionally initialized with an array of values. Optionally provide a constructor for emplace.

```ts
const queue = new Queue<number>() // Empty queue
const queue2 = new Queue(['a', 'b', 'c']) // ['a', 'b', 'c'] (front is 'a')
```

---

## Methods & Properties

### `.push(value: T): void`

Push a value to the back of the queue.

```ts
queue.push(10) // [10]
```

---

### `.pop(): T | undefined`

Remove and return the front value.

```ts
const first = queue.pop() // 10, queue is now []
```

---

### `.emplace(...args: A): void`

Construct and push a value using the provided constructor and arguments.

```ts
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
const queue = new Queue<Point, [number, number]>([], Point)
// Or even shorter
const queue = new Queue([], Point)

queue.emplace(1, 2) // queue.back is Point { x: 1, y: 2 }
```

---

### `.clear(): void`

Remove all elements from the queue.

```ts
queue.clear() // []
```

---

### `.isEmpty(): boolean`

Returns `true` if the queue is empty.

```ts
queue.isEmpty() // true
```

---

### `.front: T | undefined` (getter/setter)

Get or set the front value.

```ts
console.log(queue.front) // 10
queue.front = 20 // replaces front value with 20
```

---

### `.back: T | undefined` (getter/setter)

Get or set the back value.

```ts
console.log(queue.back) // 30
queue.back = 40 // replaces back value with 40
```

---

### `Iteration: IterableIterator<T>`

Iterate from front to back.

```ts
for (const value of queue) {
  // ...
}
```

---

### `.toArray(): T[]`

Convert the queue to an array (from front to back).

```ts
const arr = queue.toArray() // [1, 2, 3]
```

---

### `.length: number`

Number of elements in the queue.

```ts
console.log(queue.length) // 3
```

---

### `Queue.equals(queue1, queue2, comparator?): boolean` (static)

Check if two queues are equal (element-wise). Optionally, provide a custom comparator function.

```ts
Queue.equals(queue1, queue2) // true or false (uses === by default)
Queue.equals(queue1, queue2, (a, b) => a.id === b.id) // custom comparison
```

---

### `Queue.swap(queue1, queue2): void` (static)

Swap the contents of two queues.

```ts
Queue.swap(queue1, queue2)
```

---

## API Reference

| Method / Property                 | Description                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `constructor(values, TypeCtor?)`  | Create a new queue, optionally initialized with values and a constructor.<br>T.C: O(n), S.C: O(n) |
| `push(value)`                     | Push value to the back of the queue.<br>T.C: O(1), S.C: O(1)                                      |
| `pop()`                           | Remove and return the front value.<br>T.C: O(1), S.C: O(1)                                        |
| `emplace(...args)`                | Construct and push a value using the provided constructor.<br>T.C: O(1), S.C: O(1)                |
| `clear()`                         | Remove all elements.<br>T.C: O(n), S.C: O(1)                                                      |
| `isEmpty()`                       | Returns `true` if the queue is empty.<br>T.C: O(1), S.C: O(1)                                     |
| `front` (getter/setter)           | Get or set the front value.<br>T.C: O(1), S.C: O(1)                                               |
| `back` (getter/setter)            | Get or set the back value.<br>T.C: O(1), S.C: O(1)                                                |
| `[Symbol.iterator]()`             | Iterate from front to back.<br>T.C: O(1), S.C: O(1)                                               |
| `toArray()`                       | Convert the queue to an array.<br>T.C: O(n), S.C: O(n)                                            |
| `length`                          | Number of elements in the queue.<br>T.C: O(1), S.C: O(1)                                          |
| `Queue.equals(a, b, comparator?)` | Check if two queues are equal. Optionally provide a comparator.<br>T.C: O(n), S.C: O(1)           |
| `Queue.swap(a, b)`                | Swap the contents of two queues.<br>T.C: O(1), S.C: O(1)                                          |

---

## Example

```ts
const queue = new Queue<number>()
queue.push(1)
queue.push(2)
queue.push(3)
console.log(queue.front) // 1
console.log(queue.pop()) // 1
console.log([...queue]) // [2, 3]
```

---

## Notes

- The queue is implemented as a singly linked list for efficient O(1) push/pop.
- The `emplace` method requires a constructor to be provided at queue creation.
- Iteration yields values from front to back.
