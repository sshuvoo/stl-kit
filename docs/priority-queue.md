# PriorityQueue Data Structure (Comprehensive Guide)

## What is a Priority Queue?

A **Priority Queue** is a special type of queue where each element has a priority. Elements are served based on their priority, not just their order of arrival. Think of it as a line at the airport: people with higher priority (like first-class passengers) get served before others, regardless of when they arrived.

### How is it Implemented?

This PriorityQueue is built on top of a binary heap, so it is very efficient for inserting and removing the highest (or lowest) priority element.

### When to Use a Priority Queue?

- Task scheduling (run the most important job first)
- Pathfinding algorithms (like Dijkstra's or A\*)
- Simulation systems (process the next most urgent event)
- Bandwidth management (serve high-priority packets first)

---

## API and Methods

| Method      | What it does                                    | Use Case Example                            | Time Complexity |
| ----------- | ----------------------------------------------- | ------------------------------------------- | --------------- |
| constructor | Create a new priority queue                     | Initialize with custom priorities or values | O(n)            |
| push        | Add a new value with priority                   | Insert a new task or event                  | O(log n)        |
| emplace     | Add a value using a factory function            | Create and insert a complex object          | O(log n)        |
| pop         | Remove and return the highest-priority value    | Process the next most important job         | O(log n)        |
| peek        | See the highest-priority value without removing | Check which job is next without removing it | O(1)            |
| replace     | Replace the top value and return the old one    | Swap out the most urgent job for a new one  | O(log n)        |
| isEmpty     | Check if the queue is empty                     | See if there are any jobs left              | O(1)            |
| clear       | Remove all values                               | Reset the queue                             | O(1)            |
| size        | Get the number of values in the queue           | Monitor the number of pending jobs          | O(1)            |

---

## Method Details and Use Cases

### constructor(options)

**Creates a new PriorityQueue.**

- `initValues`: Initial values (numbers or PriorityNode objects)
- `compareFn`: Custom comparison function for priorities
- `factory`: Function to create new values for emplace

**Use case:**

```js
const pq = new PriorityQueue({ initValues: [5, 2, 8] })
```

### push(value)

**Adds a new value to the queue.**

- If T is number, just provide a number.
- Otherwise, provide a PriorityNode object: `{ priority, value }`

**Use case:**

```js
pq.push(10) // For number
pq.push({ priority: 1, value: 'task' }) // For objects
```

### emplace(...args)

**Adds a new value using the factory function and arguments.**

- Useful for complex objects or when you want to construct the value inline.

**Use case:**

```js
const pq = new PriorityQueue({
  factory: (priority, value) => ({ priority, value }),
})
pq.emplace(2, 'urgent task')
```

### pop()

**Removes and returns the highest-priority value.**

- Throws if the queue is empty.

**Use case:**

```js
const next = pq.pop()
```

### peek()

**Returns the highest-priority value without removing it.**

- Returns `undefined` if the queue is empty.

**Use case:**

```js
if (!pq.isEmpty()) {
  console.log('Next up:', pq.peek())
}
```

### replace(value)

**Replaces the top value with a new one and returns the old top value.**

- Throws if the queue is empty.

**Use case:**

```js
pq.replace(7)
```

### isEmpty()

**Checks if the queue is empty.**

**Use case:**

```js
if (pq.isEmpty()) {
  // No jobs left
}
```

### clear()

**Removes all values from the queue.**

**Use case:**

```js
pq.clear()
```

### size()

**Returns the number of values in the queue.**

**Use case:**

```js
console.log('Jobs left:', pq.size())
```

---

## Space and Time Complexity

- All operations are efficient, using a binary heap under the hood.
- Space: O(n), where n is the number of items.

---

## Example: Using PriorityQueue

```js
import { PriorityQueue } from 'stl-kit'

// For numbers (min-heap by default)
const pq = new PriorityQueue({ initValues: [5, 2, 8, 1] })
console.log(pq.peek()) // 1
pq.push(0)
console.log(pq.pop()) // 0

// For objects with priorities
const pq2 = new PriorityQueue({
  initValues: [
    { priority: 2, value: 'task2' },
    { priority: 1, value: 'task1' },
  ],
  compareFn: (a, b) => a.priority - b.priority,
})
console.log(pq2.pop()) // { priority: 1, value: 'task1' }
```

---

## Tips

- Use a custom `compareFn` for max-heap or custom ordering.
- Use `emplace` for efficient object creation and insertion.
- Always check `isEmpty()` before calling `pop()` or `replace()`.

---

## See Also

- [Heap](./heap.md)
- [Queue](./queue.md)
- [Stack](./stack.md)
