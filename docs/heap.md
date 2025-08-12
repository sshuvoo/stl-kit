# Heap Data Structure (for Beginners and Pros)

## What is a Heap?

A **heap** is a special kind of tree-based data structure. Imagine a heap as a big pile of toys, where the biggest toy is always on top! In programming, a heap helps us quickly find the largest (or smallest) item.

### Relation to Binary Tree and Complete Tree

- **Binary Tree**: Each parent can have up to two children.
- **Complete Tree**: All levels are filled except possibly the last, which is filled from left to right.
- **Heap**: A heap is always a complete binary tree. This means every level is full except maybe the last, and all nodes are as far left as possible.

### What Does a Heap Do?

A heap lets you:

- Always get the biggest (or smallest) item super fast.
- Add new items and keep the pile organized.
- Remove the top item and still keep the pile organized.

### Max Heap vs Min Heap

- **Max Heap**: The biggest item is always on top. (This is the default!)
- **Min Heap**: The smallest item is always on top. (Use a `compareFn` to make this happen.)

### Operations and Complexity

| Operation | What it does           | Time Complexity |
| --------- | ---------------------- | --------------- |
| push      | Add a new item         | O(log n)        |
| pop       | Remove the top item    | O(log n)        |
| peek      | See the top item       | O(1)            |
| replace   | Swap top with new item | O(log n)        |
| clear     | Remove all items       | O(1)            |
| size      | Count items            | O(1)            |
| toArray   | Get all items as array | O(n)            |

### Space Complexity

- The heap uses **O(n)** space, where n is the number of items.

---

## How Does Heap Work? (Simple Example)

Let's play with numbers!

```js
import { Heap } from 'stl-kit'

const heap = new Heap({ initValues: [5, 2, 8, 1] })
console.log(heap.peek()) // 8 (biggest number is on top)
heap.push(10)
console.log(heap.peek()) // 10 (now 10 is on top)
console.log(heap.pop()) // 10 (removes 10)
console.log(heap.peek()) // 8
```

---

## Min Heap Example (Using compareFn)

Want the smallest number on top? Use a `compareFn`!

```js
const minHeap = new Heap({
  compareFn: (a, b) => b - a, // reverse for min heap
  initValues: [5, 2, 8, 1],
})
console.log(minHeap.peek()) // 1 (smallest number is on top)
```

---

## Factory Function (What, Why, How)

### What is a Factory Function?

A **factory function** helps you create complex objects to put in the heap. Imagine you want to store toys with names and sizes, not just numbers!

### Why Use a Factory?

- You want to create objects with many properties.
- You want to control how items are made before adding to the heap.

### How Does It Work?

You give the heap a factory function. Then, you use `emplace` to add items by giving the factory the needed info.

#### Example: Storing Toys

```js
function makeToy(name, size) {
  return { name, size }
}

const toyHeap = new Heap({
  compareFn: (a, b) => a.size - b.size, // min heap by size
  factory: makeToy,
})

toyHeap.emplace('Car', 5)
toyHeap.emplace('Doll', 2)
toyHeap.emplace('Ball', 8)
console.log(toyHeap.peek()) // { name: 'Doll', size: 2 }
```

---

## API Reference

| Method              | Description                      | Example Usage                 |
| ------------------- | -------------------------------- | ----------------------------- |
| constructor         | Create a new heap                | new Heap({ ... })             |
| push(node)          | Add an item                      | heap.push(5)                  |
| emplace(...args)    | Add item using factory function  | heap.emplace('Car', 5)        |
| pop()               | Remove and return top item       | heap.pop()                    |
| peek()              | See the top item                 | heap.peek()                   |
| replace(node)       | Replace top item, return old top | heap.replace(7)               |
| isEmpty()           | Check if heap is empty           | heap.isEmpty()                |
| clear()             | Remove all items                 | heap.clear()                  |
| size()              | Get number of items              | heap.size()                   |
| toArray()           | Get all items as array           | heap.toArray()                |
| [Symbol.iterator]() | Iterate over items               | for (const x of heap) { ... } |

---

## Summary

- A heap is a special tree for quickly finding the biggest or smallest item.
- By default, it's a max heap. Use `compareFn` for min heap.
- Use a factory function to easily create and add complex objects.
- Fast operations: add, remove, peek, and more!

Happy coding! 🎉
