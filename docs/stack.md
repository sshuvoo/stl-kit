# Stack

A classic stack (LIFO) data structure implementation for JavaScript/TypeScript, supporting efficient push and pop operations, iteration, and advanced features like emplace and static utilities. Generic and type-safe for all types.

---

## Constructor

### `new Stack(values?: T[], TypeCtor?: Constructor<T, A>)`

Create a new stack, optionally initialized with an array of values. Optionally provide a constructor for emplace.

```ts
const stack = new Stack<number>() // Empty stack
const stack2 = new Stack(['a', 'b', 'c']) // ['a', 'b', 'c'] (top is 'c')
```

---

## Methods & Properties

### `.push(value: T): void`

Push a value onto the stack.

```ts
stack.push(10) // [10]
```

---

### `.pop(): T | undefined`

Remove and return the top value.

```ts
const last = stack.pop() // 10, stack is now []
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
const stack = new Stack<Point, [number, number]>([], Point)
// Or even shorter
const stack = new Stack([], Point)

stack.emplace(1, 2) // stack.top is Point { x: 1, y: 2 }
```

---

### `.clear(): void`

Remove all elements from the stack.

```ts
stack.clear() // []
```

---

### `.isEmpty(): boolean`

Returns `true` if the stack is empty.

```ts
stack.isEmpty() // true
```

---

### `.top: T | undefined` (getter/setter)

Get or set the top value.

```ts
console.log(stack.top) // 10
stack.top = 20 // replaces top value with 20
```

---

### `Iteration: IterableIterator<T>`

Iterate from top to bottom.

```ts
for (const value of stack) {
  // ...
}
```

---

### `.length: number`

Number of elements in the stack.

```ts
console.log(stack.length) // 3
```

---

### `Stack.equals(stack1, stack2, comparator?): boolean` (static)

Check if two stacks are equal (element-wise). Optionally, provide a custom comparator function.

```ts
Stack.equals(stack1, stack2) // true or false (uses === by default)
Stack.equals(stack1, stack2, (a, b) => a.id === b.id) // custom comparison
```

---

### `Stack.swap(stack1, stack2): void` (static)

Swap the contents of two stacks.

```ts
Stack.swap(stack1, stack2)
```

---

## API Reference

| Method / Property                 | Description                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `constructor(values, TypeCtor?)`  | Create a new stack, optionally initialized with values and a constructor.<br>T.C: O(n), S.C: O(n) |
| `push(value)`                     | Push value onto the stack.<br>T.C: O(1), S.C: O(1)                                                |
| `pop()`                           | Remove and return the top value.<br>T.C: O(1), S.C: O(1)                                          |
| `emplace(...args)`                | Construct and push a value using the provided constructor.<br>T.C: O(1), S.C: O(1)                |
| `clear()`                         | Remove all elements.<br>T.C: O(n), S.C: O(1)                                                      |
| `isEmpty()`                       | Returns `true` if the stack is empty.<br>T.C: O(1), S.C: O(1)                                     |
| `top` (getter/setter)             | Get or set the top value.<br>T.C: O(1), S.C: O(1)                                                 |
| `[Symbol.iterator]()`             | Iterate from top to bottom.<br>T.C: O(1), S.C: O(1)                                               |
| `length`                          | Number of elements in the stack.<br>T.C: O(1), S.C: O(1)                                          |
| `Stack.equals(a, b, comparator?)` | Check if two stacks are equal. Optionally provide a comparator.<br>T.C: O(n), S.C: O(1)           |
| `Stack.swap(a, b)`                | Swap the contents of two stacks.<br>T.C: O(1), S.C: O(1)                                          |

---

## Example

```ts
const stack = new Stack<number>()
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack.top) // 3
console.log(stack.pop()) // 3
console.log([...stack]) // [2, 1]
```

---

## Notes

- The stack is implemented as a singly linked list for efficient O(1) push/pop.
- The `emplace` method requires a constructor to be provided at stack creation.
- Iteration yields values from top to bottom.
