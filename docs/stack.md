# Stack

A classic, robust and developer-friendly **Stack** (LIFO) data structure implemented in TypeScript using a **doubly linked list** internally. Designed for flexibility, extensibility, and performance with support for `emplace`, `clone`, STL-style iterators, and more.

---

## 🚀 Quick Start

```ts
import { Stack } from 'stl-kit'

const stack = new Stack<number>()
stack.push(10)
stack.push(20)
console.log(stack.pop()) // 20
```

---

## 🏗️ Constructor

```ts
new Stack<T, A>(options?: {
  initValues?: T[]
  factory?: (...args: A) => T
})
```

- `initValues`: Optional array of values to prefill the stack.
- `factory`: Optional factory for use with `emplace()`.

---

## 📚 Instance Methods

### `push(value: T): void`

Adds a value to the top of the stack.

```ts
stack.push(42)
```

---

### `pop(): T | undefined`

Removes and returns the top value. Returns `undefined` if empty.

```ts
const val = stack.pop()
```

---

### `peek(): T | undefined`

Returns the top value without removing it.

```ts
stack.peek()
```

---

### `emplace(...args: A): void`

Constructs and pushes a value using the provided factory.

```ts
const stack = new Stack<Person, [string, number]>({
  factory: (name, age) => new Person(name, age),
})
stack.emplace('Alice', 30)
```

---

### `assign(count: number, value: T): void`

Fills the stack with `count` copies of `value`.

```ts
stack.assign(3, 99) // [99, 99, 99]
```

---

### `assign(values: T[], start?: number, end?: number): void`

Fills the stack with a slice of `values`.

```ts
stack.assign([1, 2, 3, 4], 1, 3) // [2, 3]
```

---

### `clone(deepCloneFn?: (val: T) => T): Stack<T, A>`

Returns a deep copy of the stack. Defaults to `structuredClone`.

```ts
const deep = stack.clone()
const shallow = stack.clone((v) => v)
```

---

### `clear(): void`

Removes all elements.

```ts
stack.clear()
```

---

### `toArray(): T[]`

Returns a shallow copy of the stack as an array.

```ts
const arr = stack.toArray()
```

---

### `forEach(cb, thisArg?)`

Iterates through the stack from bottom to top.

```ts
stack.forEach((val, i) => console.log(val, i))
```

---

### `begin(): IterableIterator<T>`

Returns a forward iterator (default direction).

```ts
for (const val of stack.begin()) { ... }
```

---

### `rbegin(): IterableIterator<T>`

Returns a reverse iterator (from top to bottom).

```ts
for (const val of stack.rbegin()) { ... }
```

---

## 🧾 Properties

### `length: number`

Current number of elements in the stack.

### `top: T | undefined`

Getter/setter for the top value.

```ts
stack.top = 99
const val = stack.top
```

---

## 🧰 Static Methods

### `Stack.equals(stack1, stack2, comparator?): boolean`

Checks equality of two stacks. Optionally pass a comparator.

```ts
Stack.equals(stackA, stackB)
```

---

### `Stack.swap(stack1, stack2): void`

Swaps contents of two stacks (must use same factory).

```ts
Stack.swap(stack1, stack2)
```

---

## ⚠️ Error Handling

- `top = val` throws if stack is empty.
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

| Method / Property | Signature                                           | Description                          |
| ----------------- | --------------------------------------------------- | ------------------------------------ |
| `push`            | `(value: T): void`                                  | Push a value onto the stack          |
| `pop`             | `(): T \| undefined`                                | Pop the top value from the stack     |
| `peek`            | `(): T \| undefined`                                | Return the top value without popping |
| `emplace`         | `(...args: A): void`                                | Push using a factory                 |
| `assign` (count)  | `(count: number, value: T): void`                   | Fill stack with repeated value       |
| `assign` (slice)  | `(values: T[], start?: number, end?: number): void` | Fill stack with slice of array       |
| `clone`           | `(deepCloneFn?): Stack<T, A>`                       | Clone the stack                      |
| `clear`           | `(): void`                                          | Empty the stack                      |
| `toArray`         | `(): T[]`                                           | Convert to array                     |
| `forEach`         | `(cb, thisArg?): void`                              | Loop through elements                |
| `begin`           | `(): IterableIterator<T>`                           | Forward iterator                     |
| `rbegin`          | `(): IterableIterator<T>`                           | Reverse iterator                     |
| `length`          | `number`                                            | Number of elements                   |
| `top`             | `T \| undefined` (getter/setter)                    | Get/set top value                    |
| `Stack.equals`    | `(stack1, stack2, comparator?): boolean`            | Compare two stacks                   |
| `Stack.swap`      | `(stack1, stack2): void`                            | Swap contents of two stacks          |

---

## 📎 License & Contributions

This package is open-source under the MIT License. Feel free to submit issues or pull requests on GitHub.
